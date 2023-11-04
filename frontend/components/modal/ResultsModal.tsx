import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useContract, useProvider, useSigner } from 'wagmi'
import * as Dialog from '@radix-ui/react-dialog'
import { HOTPOT_ABI_G, HOTPOT_CONTRACT_G } from '../../contracts/index'
import { useAccount } from 'wagmi'
import { PotData } from 'lib/getRafflePot'
import { CgSpinner } from 'react-icons/cg'
import { HiX } from 'react-icons/hi'
import { getResult } from 'lib/getResult'
import { setToast } from 'components/token/setToast'
import Modal from './Modal'
import usePrizePool from 'hooks/usePrizePool'
import { FaTwitter } from 'react-icons/fa'

type Ticket = {
  ticket_id: number
  is_winner: boolean
}

type ClaimCallbackData = {
  ticketId?: string
}

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  ticketId?: number
  amount?: string
  loading?: boolean
  onGoToToken?: () => any
  onClaimComplete?: (data: ClaimCallbackData) => void
  onClaimError?: (error: Error, data: ClaimCallbackData) => void
  onClose?: () => void
}

const ResultsModal: React.FC<Props> = ({ trigger, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [potData, setPotData] = useState<PotData | null>(null)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { address } = useAccount()
  const { data: prizePool } = usePrizePool()
  const [showButton, setShowButton] = useState(false)
  const [showTweetToClaimLink, setShowTweetToClaimLink] = useState(true)

  const handleClaim = async () => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      if (!Hotpot) {
        console.log('NftMarketplace contract instance is not available.')
        return
      }
      const claimPrize = await Hotpot.claim()
      setIsLoading(false)
      console.log('Listing Transaction Hash:', claimPrize.hash)
      setIsSuccess(true)
      setToast({
        kind: 'complete',
        message: 'Prize has been sent to your wallet',
        title: 'Successfully Claimed',
      })

      const winningTicketIds = potData?.tickets
        ? potData.tickets
            .filter((ticket: Ticket) => ticket.is_winner)
            .map((ticket: Ticket) => ticket.ticket_id)
        : []
      localStorage.setItem(
        'winningTicketStore',
        JSON.stringify(winningTicketIds)
      )
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      setError('Oops, something went wrong. Please try again')
      setToast({
        kind: 'error',
        message: 'You have already claimed the prize',
        title: 'Claim Error',
      })
    }
  }

  useEffect(() => {
    const fetchPotData = async () => {
      if (address) {
        const potData = await getResult(address)
        setPotData(potData)
        setIsMounted(true)
      }
    }
    fetchPotData()
  }, [address])

  const Hotpot = useContract({
    address: HOTPOT_CONTRACT_G,
    abi: HOTPOT_ABI_G,
    signerOrProvider: signer || provider,
  })

  const handleClose = () => {
    if (onClose) {
      onClose()
    }

    setError(null)
    setIsLoading(false)
  }

  if (!isMounted) {
    return null
  }

  const winningTicketIds = potData?.tickets
    ? potData.tickets
        .filter((ticket: Ticket) => ticket.is_winner)
        .map((ticket: Ticket) => ticket.ticket_id)
    : []

  const storedTicketsJson = JSON.parse(
    localStorage.getItem('winningTicketStore') || '[]'
  )
  const isClaimed = winningTicketIds.includes(Number(storedTicketsJson))

  const handleTweetToClaimClick = () => {
    setButtonLoading(true)
    setTimeout(() => {
      setShowTweetToClaimLink(false)
      setShowButton(true)
      setButtonLoading(false)
    }, 5000)
  }

  let win = (
    <div className="rounded-xl bg-gradient-to-r from-[#FEF0D6] to-[#FFECAC]  pb-4 ">
      <div className="flex flex-row justify-between">
        {' '}
        <Dialog.Title></Dialog.Title>
        <Dialog.Close asChild>
          <button
            onClick={handleClose}
            className="m-3 inline-flex h-[20px] w-[20px] items-center justify-center text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <HiX className="h-3 w-3" />
          </button>
        </Dialog.Close>
      </div>
      <div className="mx-4 mt-6 flex flex-col items-center justify-center">
        <h1 className="reservoir-h1 mb-2 text-[40px] font-semibold text-[#101828] dark:text-yellow-900">
          Congratulations!
        </h1>
        {winningTicketIds.length > 0 && (
          <p className="reservoir-subtitle text-base font-medium dark:text-black">
            You won {prizePool?.potLimit} ETH
            {/* {winningTicketIds.length === 1 ? ' Ticket' : ' Tickets'} #
            {winningTicketIds.join(winningTicketIds.length === 1 ? '' : ', #')} */}
          </p>
        )}
        <img src="/gold-chest.svg" className="my-4 w-[240px]" />

        {showTweetToClaimLink && (
          <button className="">
            <a
              href="https://twitter.com/intent/tweet?text=Just%20won%201.0%20ETH%20by%20trading%20NFTs%20on%20%40hotpot_gg!%0A%0AZero%20creator%20royalties%2C%20a%20fair%20lottery%20system%2C%20and%20a%20chance%20to%20win%20big.%0A%0AJust%20by%20trading%20as%20I%20normally%20would.%0A%0ANo%20extra%20fees.%20Everything%20on-chain.%20hotpot.gg"
              className="twitter-share-button my-2 flex flex-row items-center gap-2 rounded-full bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white"
              data-show-count="false"
              data-size="large"
              target="_blank"
              onClick={handleTweetToClaimClick}
            >
              <FaTwitter className="text-white " />
              Tweet to Claim
              {buttonLoading && (
                <CgSpinner className="mr-2 h-4 w-4 animate-spin text-white"></CgSpinner>
              )}
            </a>
          </button>
        )}

        {showButton && (
          <button
            onClick={handleClaim}
            className="mb-4 flex items-center justify-center rounded-full border border-[#FFF06A] bg-gradient-to-b from-[#FFE179] to-[#FFB52E] px-16 py-3 text-sm font-medium text-[#CD7100] hover:from-[#FFC269] hover:to-[#FFB82E] focus:outline-none"
            disabled={isLoading || isSuccess || isClaimed}
          >
            {isLoading ? (
              <CgSpinner className="mr-2 h-5 w-5 animate-spin"></CgSpinner>
            ) : isSuccess || isClaimed ? (
              'CLAIMED'
            ) : (
              'CLAIM'
            )}
          </button>
        )}
      </div>
    </div>
  )

  let result = (
    <div className="rounded-xl bg-[#FFF5F5] pb-4 dark:bg-neutral-800">
      <div className="flex flex-row justify-between ">
        {' '}
        <Dialog.Title></Dialog.Title>
      </div>
      <div className="mx-4 mt-6 flex flex-col items-center justify-center">
        <h1 className="reservoir-h1 mx-2 mb-2 text-center text-[40px] font-semibold text-[#101828]">
          Sorry, your ticket(s) did not win
        </h1>
        <p className="reservoir-subtitle font-medium">
          Don't sweat! Try your luck on the next draw!
        </p>
        <img src="/sad.svg" className="w-[200px]" />

        <Dialog.Close asChild>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="mb-4 rounded-full bg-[#6A3CF5] px-16 py-3 text-sm font-medium text-white hover:bg-[#7C4CF5]"
          >
            Close
          </button>
        </Dialog.Close>
      </div>
    </div>
  )

  const content = winningTicketIds.length > 0 ? win : result
  return (
    <Modal trigger={trigger}>
      <Dialog.Content className="rounded-4xl fixed top-[50%] left-[50%] z-[100000000000000] mt-10 w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] backdrop-blur-md focus:outline-none data-[state=open]:animate-contentShow">
        {content}
      </Dialog.Content>
    </Modal>
  )
}

export default ResultsModal
