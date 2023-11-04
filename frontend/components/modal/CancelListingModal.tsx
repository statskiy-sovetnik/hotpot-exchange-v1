import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ethers } from 'ethers'
import { useBalance, useContract, useNetwork, useSigner } from 'wagmi'
import * as Dialog from '@radix-ui/react-dialog'
import { CgSpinner } from 'react-icons/cg'
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi'
import {
  abi,
  HOTPOT_ABI_G,
  MARKET_ABI_G,
  MARKET_CONTRACT_G,
} from '../../contracts/index'
import { setToast } from 'components/token/setToast'
import { TokenDetails } from 'types/reservoir'
import { optimizeImage } from 'lib/optmizeImage'
import { useMediaQuery } from '@react-hookz/web'
import { formatBN, formatDollar } from 'lib/numbers'
import { SWRResponse, mutate } from 'swr'
import { useAccount } from 'wagmi'
import { HotpotListing } from 'types/hotpot'
import useCoinConversion from 'hooks/useCoinConversion'
import Image from 'next/legacy/image'
import Modal from './Modal'
import { FaGasPump } from 'react-icons/fa'
import useHotpotListings from 'hooks/useHotpotListings'

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  price?: string
  loading?: boolean
  totalPrice?: number
  tokenDetails?: TokenDetails
  collectionImage?: string | undefined
  onGoToToken?: () => any

  onClose?: () => void
  mutateToken?: SWRResponse['mutate']
  hotpotListing?: HotpotListing
  url: string
}

const CancelListingModal: React.FC<Props> = ({
  trigger,
  price,
  tokenDetails,
  collectionImage,
  mutateToken,
  hotpotListing,
  url,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const { data: signer } = useSigner()
  const { address } = useAccount()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [txn, setTxn] = useState<string>('')
  const { mutate: mutateHotpot } = useHotpotListings(url)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')
  const imageSize = singleColumnBreakpoint ? 533 : 250
  const shortTxn = txn.slice(0, 4) + '...' + txn.slice(-4)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const formattedPrice = price && formatBN(parseFloat(price), 4, 18)

  const NftMarketplace = useContract({
    address: MARKET_CONTRACT_G,
    abi: MARKET_ABI_G,
    signerOrProvider: signer,
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!NftMarketplace) {
        console.log('NftMarketplace contract instance is not available.')
        return
      }

      if (hotpotListing) {
        const params = {
          offerer: hotpotListing.offerer,
          offerItem: {
            offerToken: hotpotListing.offer_token,
            offerTokenId: hotpotListing.offer_token_id.toString(),
            offerAmount: hotpotListing.offer_amount.toString(),
            endTime: hotpotListing.end_time.toString(),
          },
          royalty: {
            royaltyPercent: hotpotListing.royalty_percent.toString(),
            royaltyRecipient: hotpotListing.royalty_recipient,
          },

          salt: hotpotListing.salt.toString(),
        }

        const cancelListing = await NftMarketplace.cancelOrder(params)

        setIsApproved(true)
        console.log('Cancel Listing Tx Hash:', cancelListing.hash)
        setTxn(cancelListing.hash)
        await cancelListing.wait()
        setIsApproved(false)
        setIsSuccess(true)
        setIsLoading(false)
        setToast({
          kind: 'complete',
          message: '',
          title: 'User canceled listing',
        })
      } else {
        console.error('Error  hotpot listing not available.')
        setIsLoading(false)
        setError('Error hotpot listing not available.')
        setToast({
          kind: 'error',
          message: 'Error  hotpot listing not available.',
          title: 'Could not cancel listing',
        })
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      setError('Oops, something went wrong. Please try again')
      setToast({
        kind: 'error',
        message: 'The transaction was not completed.',
        title: 'Could not cancel listing',
      })
    }
  }

  const onClose = () => {
    setError(null)
    setIsSuccess(false)
    if (mutateToken) {
      mutateToken()
    }

    if (mutateHotpot) {
      mutateHotpot()
    }

    if (address) {
      mutate(['latestPot', address])
    }
  }

  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  const hotpotUsdPrice =
    hotpotUsdConversion && price
      ? hotpotUsdConversion * parseFloat(price)
      : null

  if (!isMounted) {
    return null
  }

  return (
    <Modal trigger={trigger}>
      <Dialog.Content className="fixed top-[50%] left-[50%] mt-10 w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white pb-4 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow dark:bg-neutral-800 dark:text-white">
        <div className="flex flex-row justify-between rounded bg-[#F8F8F8] p-4 dark:bg-[#262A2B]">
          {' '}
          <Dialog.Title>
            <h2 className="text-md m-0 items-center justify-center font-semibold text-gray-900 dark:text-white">
              {isSuccess
                ? 'Your listing has been cancelled'
                : isApproved
                ? 'Finalizing on the blockchain'
                : 'Cancel Listing'}
            </h2>
          </Dialog.Title>
          <Dialog.Close asChild>
            <button
              onClick={onClose}
              className="inline-flex h-[25px] w-[25px] items-center justify-center text-gray-600 focus:outline-none dark:text-white"
              aria-label="Close"
            >
              <HiX />
            </button>
          </Dialog.Close>
        </div>

        <div className="m-2 flex min-h-[200px] flex-grow flex-col md:flex-grow md:flex-col">
          {isSuccess ? (
            <>
              <div className="relative mt-4 flex flex-col items-center justify-center gap-2">
                <div className="scale-120 absolute inset-0 z-10 mt-6 flex transform items-center justify-center"></div>
                <HiCheckCircle className=" h-[80px] w-[80px] items-center justify-center text-green-700" />
                <h1 className="text-xl font-semibold">Listing Canceled!</h1>
                <div className="px-10 text-center text-sm text-gray-500 dark:text-neutral-300">
                  Your{' '}
                  <span className="text-[#7000FF] dark:text-violet-500">
                    Hotpot
                  </span>{' '}
                  listing for
                  <span className="text-[#7000FF] text-violet-500">
                    {' '}
                    {tokenDetails?.collection?.name} #
                    {tokenDetails?.name || tokenDetails?.tokenId}
                  </span>{' '}
                  at {formattedPrice?.toString()} ETH has been canceled.
                </div>
              </div>
              <div className="z-20 mt-4 bg-white text-center text-xs font-light text-gray-400 dark:bg-neutral-800">
                <a
                  href={`https://etherscan.io/tx/${txn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  View Transaction: {shortTxn}
                </a>
              </div>

              <Dialog.Close asChild>
                <button
                  onClick={onClose}
                  className="mx-4 mt-4 rounded bg-[#7000FF] py-2 text-white hover:bg-[#430099]"
                >
                  Close
                </button>
              </Dialog.Close>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1 p-2 ">
                {error && (
                  <div className="flex flex-row items-center justify-center gap-2 rounded-sm border bg-gray-100 px-5 py-2 text-xs font-light text-gray-700 dark:border-0 dark:bg-neutral-700 dark:text-neutral-300">
                    <HiExclamationCircle className="h-4 w-4 text-red-500" />
                    {error}
                  </div>
                )}
                <div className="mb-2 text-sm text-gray-500 dark:text-neutral-300">
                  Item
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row items-center justify-center gap-2">
                    {' '}
                    {tokenDetails?.image ? (
                      <div className="w-[50px] rounded-sm object-fill">
                        <Image
                          loader={({ src, width }) => {
                            return `${src}?w=${width}`
                          }}
                          src={optimizeImage(tokenDetails?.image, imageSize)}
                          alt={`${tokenDetails?.name}`}
                          className="w-full"
                          width="16"
                          height="16"
                          objectFit="cover"
                          layout="responsive"
                        />
                      </div>
                    ) : (
                      <div className="w-[50px] rounded-sm object-fill">
                        <img
                          src={optimizeImage(collectionImage, 16)}
                          alt={`${tokenDetails?.collection?.name}`}
                          className="object-cover"
                          width="16"
                          height="16"
                        />
                      </div>
                    )}
                    <div className="flex w-[240px] flex-col justify-center overflow-hidden">
                      <h1 className="truncate font-semibold ">
                        {tokenDetails?.name || tokenDetails?.tokenId}
                      </h1>
                      <p className="truncate text-sm text-gray-500 dark:text-neutral-300">
                        {tokenDetails?.collection?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <img src="/hotpot.png" className="h-6 w-6" />
                    <div className="flex flex-row items-center justify-center gap-1 ">
                      <img src="/eth.png" alt="eth" className="h-4 w-4" />
                      <div className="text-md font-semibold">
                        {formattedPrice?.toString()}
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-600 dark:text-neutral-300">
                      {formatDollar(hotpotUsdPrice)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2 border-t"></div>
              <main className="mt-4 flex flex-col justify-between px-4">
                <div className="flex flex-row items-center justify-center">
                  <div className="text-center text-xs font-light text-gray-500 dark:text-gray-400">
                    This action will cancel your listing. You will be prompted
                    to confirm this cancellation from your wallet. A gas fee is
                    required.
                  </div>
                </div>

                <div>
                  <div className="mt-[16px] flex justify-end gap-4">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className={`w-full rounded py-2 text-white ${
                        isLoading
                          ? ' cursor-not-allowed bg-[#7000FF]'
                          : 'bg-[#7000FF] hover:bg-[#430099]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <CgSpinner className="mr-2 inline-block h-6 w-6 animate-spin" />
                          {isApproved
                            ? 'Waiting to be Validated'
                            : 'Waiting for Approval'}
                        </>
                      ) : error ? (
                        'Retry'
                      ) : (
                        <>
                          <FaGasPump className="mr-2 inline-block h-4 w-4" />
                          Continue to Cancel
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </main>
            </>
          )}
        </div>
      </Dialog.Content>
    </Modal>
  )
}

export default CancelListingModal
