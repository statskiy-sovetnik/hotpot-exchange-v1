import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { ethers } from 'ethers'
import { useBalance, useContract, useNetwork, useSigner } from 'wagmi'
import * as Dialog from '@radix-ui/react-dialog'
import { CgSpinner } from 'react-icons/cg'
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi'
import { MARKET_ABI_G, MARKET_CONTRACT_G, abi } from '../../contracts/index'
import { setToast } from 'components/token/setToast'
import { TokenDetails } from 'types/reservoir'
import { optimizeImage } from 'lib/optmizeImage'
import { useMediaQuery } from '@react-hookz/web'
import { formatBN, formatDollar } from 'lib/numbers'
import { SWRResponse, mutate } from 'swr'
import { useAccount } from 'wagmi'
import { HotpotListing } from 'types/hotpot'
import ConnectWalletButton from 'components/ConnectWalletButton'
import FormatNativeCrypto from 'components/FormatNativeCrypto'
import useCoinConversion from 'hooks/useCoinConversion'
import useHotpotListings from 'hooks/useHotpotListings'
import useHotpotActivity from 'hooks/useHotpotActivity'
import usePrizePool from 'hooks/usePrizePool'
import Image from 'next/legacy/image'
import useFees from 'hooks/useFees'
import useTix from 'lib/tix'
import Modal from './Modal'
import Decimal from 'decimal.js'

interface OrderParameters {
  offerer: string
  offerItem: OfferItem
  royalty: RoyaltyData
  pendingAmountsData: PendingAmountData
  salt: number
  orderSignature: string
  pendingAmountsSignature: string
  tokenType: number
}

interface OfferItem {
  offerToken: string
  offerTokenId: number
  offerAmount: number
  endTime: number
}

interface RoyaltyData {
  royaltyPercent: number
  royaltyRecipient: string
}

interface PendingAmountData {
  offererPendingAmount: string
  buyerPendingAmount: string
  orderHash: string
}

type BuyCallbackData = {
  tokenId?: string
  collectionId?: string
}

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  price?: string
  loading?: boolean
  totalPrice?: number
  tokenDetails?: TokenDetails
  collectionImage?: string | undefined
  onGoToToken?: () => any
  onBuyComplete?: (data: BuyCallbackData) => void
  onBuyError?: (error: Error, data: BuyCallbackData) => void
  onClose?: () => void
  mutateToken?: SWRResponse['mutate']
  hotpotListing?: HotpotListing
  url: string
}

const BuyModal: React.FC<Props> = ({
  trigger,
  price,
  tokenDetails,
  collectionImage,
  mutateToken,
  hotpotListing,
  url,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: prizePool } = usePrizePool()
  const { data: tradeFee } = useFees()
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const account = useAccount()
  const { data: balance } = useBalance({ address: account?.address })
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [txn, setTxn] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { chain: activeChain } = useNetwork()
  const { mutate: mutateHotpot } = useHotpotListings(url)
  const { mutate: mutatePrizePool } = usePrizePool()
  const { mutate: mutateActivity } = useHotpotActivity(
    address?.toString() || ''
  )
  const tix = useTix(price ?? '0')
  const totalPrice = ethers.utils.formatEther(
    (hotpotListing &&
      hotpotListing.total_price &&
      hotpotListing?.total_price.toString()) ||
      '0'
  )
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')
  const imageSize = singleColumnBreakpoint ? 533 : 250
  const shortTxn = txn.slice(0, 4) + '...' + txn.slice(-4)
  const isLowBalance = (balance?.formatted ?? 0) < (totalPrice ?? 0)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const NftMarketplace = useContract({
    address: MARKET_CONTRACT_G,
    abi: MARKET_ABI_G,
    signerOrProvider: signer,
  })

  const handleFulfillOrder = async () => {
    try {
      if (hotpotListing) {
        const fulfillOrder = {
          order_hash: hotpotListing.order_hash,
          fulfiller: account.address,
        }

        const req = JSON.stringify(fulfillOrder)

        // Put Request
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: req,
        }

        const res = await fetch(
          `https://api.metalistings.xyz/order?chain=mainnet`,
          requestOptions
        )

        return res
      }
    } catch (error) {
      console.error('Error in listing:', error)
    }
  }
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!NftMarketplace) {
        console.log('NftMarketplace contract instance is not available.')
        return
      }
      if (!prizePool) {
        console.log('Wait for prize pool to load')
        return
      }
      if (!tradeFee) {
        console.log('Wait for prize pool to load')
        return
      }
      if (!hotpotListing) {
        console.log('Wait for prize pool to load')
        return
      }
      if (!tokenDetails) {
        console.log('Wait for token details to load')
        return
      }

      const res = await handleFulfillOrder()

      if (res) {
        const orderData = await res.json()

        const params: OrderParameters = {
          offerer: orderData.offerer,
          offerItem: {
            offerToken: orderData.offer_item.offer_token,
            offerTokenId: orderData.offer_item.offer_token_id.toString(),
            offerAmount: orderData.offer_item.offer_amount.toString(),
            endTime: orderData.offer_item.end_time,
          },
          royalty: {
            royaltyPercent: orderData.royalty.royalty_percent,
            royaltyRecipient: orderData.royalty.royalty_recipient,
          },
          pendingAmountsData: {
            offererPendingAmount:
              orderData.seller_pending_amount.pending_amount,
            buyerPendingAmount: orderData.buyer_pending_amount.pending_amount,
            orderHash: orderData.order_hash,
          },
          salt: orderData.salt.toString(),
          orderSignature: orderData.order_signature,
          pendingAmountsSignature: orderData.pending_amount_signature,
          tokenType: tokenDetails?.kind === 'erc1155' ? 1 : 0,
        }

        const totalPrice = hotpotListing.total_price.toString()
        //For Last Trade Calculation
        const tradeAmount = ethers.utils.formatEther(
          (hotpotListing &&
            hotpotListing.total_price &&
            hotpotListing?.total_price.toString()) ||
            '0'
        )
        const currentPotD = new Decimal(prizePool?.currentPotSize)
        const potLimitD = new Decimal(prizePool?.potLimit)
        const tradeAmountD = new Decimal(tradeAmount)
        const tradeFeeD = new Decimal(tradeFee)

        // const isLastTrade =
        //   (parseInt(tradeAmount) * tradeFee) / 10000 + currentPot >= potLimit
        const isLastTrade = tradeAmountD
          .times(tradeFeeD)
          .dividedBy(10000)
          .plus(currentPotD)
          .gte(potLimitD)
        const gasEstimate = await NftMarketplace.estimateGas.fulfillOrder(
          params,
          {
            value: totalPrice,
          }
        )

        const txParams = {
          value: totalPrice,
          ...(isLastTrade && { gasLimit: gasEstimate.add(40000) }),
        }

        const buyNFT = await NftMarketplace.fulfillOrder(params, txParams)

        setIsApproved(true)
        console.log('Listing Transaction Hash:', buyNFT.hash)
        setTxn(buyNFT.hash)
        await buyNFT.wait()
        setIsApproved(false)
        setIsSuccess(true)
        setIsLoading(false)
        setToast({
          kind: 'complete',
          message: '',
          title: 'Purchase Complete',
        })
      } else {
        console.error('Error fulfilling order or hotpot listing not available.')
        setIsLoading(false)
        setError('Error fulfilling order or hotpot listing not available.')
        setToast({
          kind: 'error',
          message: 'Error fulfilling order or hotpot listing not available.',
          title: 'Could not buy token',
        })
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      setError('Oops, something went wrong. Please try again')
      setToast({
        kind: 'error',
        message: 'The transaction was not completed.',
        title: 'Could not buy token',
      })
    }
  }

  const onClose = () => {
    setError(null)
    setIsSuccess(false)
    if (mutateToken) {
      mutateToken()
    }
    if (mutateActivity) {
      mutateActivity()
    }
    if (mutateHotpot) {
      mutateHotpot()
    }
    if (mutatePrizePool) {
      mutatePrizePool()
    }

    if (address) {
      mutate(['latestPot', address])
    }
    if (mutate) {
      mutate(['getPotDraw'])
    }
  }

  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  const hotpotUsdPrice =
    hotpotUsdConversion && price
      ? hotpotUsdConversion * parseFloat(price)
      : null

  const hotpotUsdTotalPrice =
    hotpotUsdConversion && totalPrice
      ? hotpotUsdConversion * parseFloat(totalPrice)
      : null

  if (!isMounted) {
    return null
  }

  const formattedPrice = price && formatBN(parseFloat(price), 4, 18)
  const formattedTotalPrice =
    totalPrice && formatBN(parseFloat(totalPrice), 4, 18)

  return (
    <Modal trigger={trigger}>
      <Dialog.Content className="fixed top-[50%] left-[50%] mt-10 w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded bg-white pb-4 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-400">
        <div className="flex flex-row justify-between rounded-t bg-[#F8F8F8] p-4 dark:bg-[#262A2B]">
          {' '}
          <Dialog.Title>
            <h2 className="text-md m-0 items-center justify-center font-semibold text-gray-900 dark:text-white">
              {isSuccess
                ? 'Your purchase has been processed!'
                : isApproved
                ? 'Finalizing on the blockchain'
                : 'Complete Checkout'}
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

        <div className="m-2 flex min-h-[200px] flex-grow flex-col dark:bg-neutral-800 dark:text-white md:flex-grow md:flex-col">
          {isSuccess ? (
            <>
              <div className="relative mt-4 flex flex-col items-center justify-center gap-2">
                <div className="scale-120 absolute inset-0 z-10 mt-6 flex transform items-center justify-center">
                  <img src="/success.gif" className="object-cover" />
                </div>
                <HiCheckCircle className=" h-[80px] w-[80px] items-center justify-center text-green-700" />
                <h1 className="text-xl font-semibold">
                  NFT Purchase Successful! 🎉
                </h1>
                <div className="text-sm font-light text-gray-500 dark:text-neutral-300">
                  Your NFT has been sent to your wallet
                </div>
                <div className="z-20 mt-4 bg-white text-xs font-light text-gray-400 dark:bg-neutral-800 dark:text-white">
                  <a
                    href={`https://etherscan.io/tx/${txn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View Transaction: {shortTxn}
                  </a>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  onClick={onClose}
                  className="mx-4 mt-4  rounded bg-[#7000FF] py-2 text-white hover:bg-[#430099]"
                >
                  Close
                </button>
              </Dialog.Close>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1 p-2 ">
                {error && (
                  <div className="flex flex-row items-center justify-center gap-2 rounded-sm border bg-gray-100 px-5 py-2 text-xs font-light text-gray-700 dark:border-0 dark:bg-neutral-900 dark:text-neutral-300">
                    <HiExclamationCircle className="h-4 w-4 text-red-500" />
                    {error}
                  </div>
                )}
                <div className="flex flex-row items-center justify-between">
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-300">
                    Item
                  </div>
                  {tix > 0 && (
                    <div className="z-10 rounded border border-[#0FA46E] bg-[#DBF1E4] px-2 text-sm font-normal text-[#0FA46E] dark:bg-neutral-800 md:hidden">
                      +{tix} TIX
                    </div>
                  )}
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
                          width={imageSize}
                          height={imageSize}
                          objectFit="cover"
                          layout="responsive"
                        />
                      </div>
                    ) : (
                      <div className="w-[50px] rounded-sm object-fill text-sm">
                        <Image
                          loader={({ src }) => src}
                          src={optimizeImage(collectionImage, imageSize)}
                          alt={`${tokenDetails?.collection?.name}`}
                          className="w-full"
                          width={imageSize}
                          height={imageSize}
                          objectFit="cover"
                          layout="responsive"
                        />
                      </div>
                    )}
                    <div className="flex  flex-col justify-center overflow-hidden  md:w-[240px]">
                      <h1 className="truncate text-xs font-semibold md:text-sm ">
                        {tokenDetails?.name || tokenDetails?.tokenId}
                      </h1>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-300 md:text-sm">
                        {tokenDetails?.collection?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex flex-row items-center justify-center gap-1 ">
                      {tix > 0 && (
                        <div className="z-10 hidden rounded border border-[#0FA46E] bg-[#DBF1E4] px-2 text-sm font-normal text-[#0FA46E] dark:bg-neutral-800 md:block">
                          +{tix} TIX
                        </div>
                      )}
                      <img src="/eth.png" alt="eth" className="h-4 w-4" />
                      <div className="md:text-md text-sm font-semibold">
                        {formattedPrice?.toString()}
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-600 dark:text-neutral-300">
                      {formatDollar(hotpotUsdPrice)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2 border-t dark:border-neutral-700"></div>
              <main className="mt-4 flex flex-col justify-between px-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="text-sm font-medium text-gray-900 dark:text-white md:text-lg">
                    Total
                  </div>
                  <div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex flex-row items-center justify-center gap-1">
                        <img src="/eth.png" className="h-5 w-5" />
                        <div className="text-base font-semibold text-black dark:text-white">
                          {formattedTotalPrice.toString()}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-300">
                        {formatDollar(hotpotUsdTotalPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {isLowBalance && account.isConnected && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-center">
                      <span className="text-sm text-[#FF6369]">
                        Insufficient balance{' '}
                      </span>
                      <FormatNativeCrypto amount={balance?.value} />
                    </div>
                  )}
                  {account.isDisconnected ? (
                    <div className="mt-2 flex items-center justify-center gap-1 text-center">
                      <Dialog.Close asChild>
                        <button onClick={onClose}>
                          <ConnectWalletButton className="w-full">
                            <span>Connect Wallet</span>
                          </ConnectWalletButton>
                        </button>
                      </Dialog.Close>
                    </div>
                  ) : (
                    <div className="mt-[16px] flex justify-end gap-4">
                      <button
                        onClick={handleSubmit}
                        disabled={
                          isLoading ||
                          isLowBalance ||
                          !tradeFee ||
                          !hotpotListing ||
                          !prizePool
                        }
                        className={`w-full rounded py-2 text-white ${
                          isLoading ||
                          isLowBalance ||
                          !tradeFee ||
                          !hotpotListing ||
                          !prizePool
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
                          'Checkout'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </main>
            </>
          )}
        </div>
      </Dialog.Content>
    </Modal>
  )
}

export default BuyModal
