import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react'
import { ethers } from 'ethers'
import { SWRResponse } from 'swr'
import { formatBN, formatDollar } from 'lib/numbers'
import { TokenDetails } from 'types/reservoir'
import { optimizeImage } from 'lib/optmizeImage'
import { useMediaQuery } from '@react-hookz/web'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import { setToast } from 'components/token/setToast'
import { CgChevronDown, CgMore, CgSpinner } from 'react-icons/cg'
import {
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSignTypedData,
  useSigner,
} from 'wagmi'
import { HiCheckCircle, HiExclamationCircle, HiX } from 'react-icons/hi'
import {
  MARKET_ABI_G,
  MARKET_CONTRACT_G,
  ERC721abi,
} from '../../contracts/index'
import dayjs, { ManipulateType } from 'dayjs'
import useOnChainRoyalties from 'hooks/useOnChainRoyalties'
import useCoinConversion from 'hooks/useCoinConversion'
import InfoTooltip from 'components/InfoTooltip'
import Image from 'next/legacy/image'
import useTix from 'lib/tix'
import Modal from './Modal'
import Link from 'next/link'
import useHotpotListings from 'hooks/useHotpotListings'
import { useRouter } from 'next/router'
import useFees from 'hooks/useFees'
import Decimal from 'decimal.js'

export type ExpirationOption = {
  text: string
  value: string
  relativeTime: number | null
  relativeTimeUnit: ManipulateType | null
}

const expirationOptions: ExpirationOption[] = [
  {
    text: '1 Hour',
    value: 'hour',
    relativeTime: 1,
    relativeTimeUnit: 'h',
  },
  {
    text: '12 Hours',
    value: '12 hours',
    relativeTime: 12,
    relativeTimeUnit: 'h',
  },
  {
    text: '1 Day',
    value: '1 day',
    relativeTime: 1,
    relativeTimeUnit: 'd',
  },
  {
    text: '3 Day',
    value: '3 days',
    relativeTime: 3,
    relativeTimeUnit: 'd',
  },
  { text: '1 Week', value: 'week', relativeTime: 1, relativeTimeUnit: 'w' },
  { text: '1 Month', value: 'month', relativeTime: 1, relativeTimeUnit: 'M' },
  {
    text: '3 Months',
    value: '3 months',
    relativeTime: 3,
    relativeTimeUnit: 'M',
  },
  {
    text: '6 Months',
    value: '6 months',
    relativeTime: 6,
    relativeTimeUnit: 'M',
  },
]

// The named list of all type definitions
const types = {
  OfferItem: [
    { name: 'offerToken', type: 'address' },
    { name: 'offerTokenId', type: 'uint256' },
    { name: 'offerAmount', type: 'uint256' },
    { name: 'endTime', type: 'uint256' },
  ],
  RoyaltyData: [
    { name: 'royaltyPercent', type: 'uint256' },
    { name: 'royaltyRecipient', type: 'address' },
  ],
  Order: [
    { name: 'offerer', type: 'address' },
    { name: 'offerItem', type: 'OfferItem' },
    { name: 'royalty', type: 'RoyaltyData' },
    { name: 'salt', type: 'uint256' },
  ],
}

const ModalCopy = {
  title: 'List Item for sale',
  ctaClose: 'Close',
  ctaSetPrice: 'Set your price',
  ctaList: 'List for Sale',
  ctaAwaitingApproval: 'Waiting for Approval',
  ctaEditListing: 'Edit Listing',
  ctaRetry: 'Retry',
  ctaGoToToken: 'Go to Token',
}

enum STEPS {
  SelectMarkets = 0,
  SetPrice = 1,
  ListItem = 2,
  Complete = 3,
}

type Props = Pick<Parameters<typeof Modal>['0'], 'trigger'> & {
  openState?: [boolean, Dispatch<SetStateAction<boolean>>]
  tokenId?: string
  tokenDetails?: TokenDetails
  collectionId?: string
  nativeOnly?: boolean
  normalizeRoyalties?: boolean
  enableOnChainRoyalties?: boolean
  oracleEnabled?: boolean
  copyOverrides?: Partial<typeof ModalCopy>
  feesBps?: string[]
  onGoToToken?: () => any
  onListingError?: (error: Error) => void
  onClose?: () => void
  mutate?: SWRResponse['mutate']
  url: string
}

const ListModal: React.FC<Props> = ({
  trigger,
  tokenId,
  tokenDetails,
  collectionId,
  onListingError,
  mutate,
  url,
}) => {
  const router = useRouter()
  const [step, setStep] = useState(STEPS.SelectMarkets)
  const [isLoading, setIsLoading] = useState(false)
  const provider = useProvider()
  const { data: signer } = useSigner()
  const account = useAccount()
  const { mutate: mutateHotpot } = useHotpotListings(url)
  const { data: tradeFee } = useFees()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [priceValue, setPriceValue] = useState<number>(0)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [alert, setAlert] = useState<string | null>(null)
  const [txn, setTxn] = useState<string>('')
  const { chain: activeChain } = useNetwork()
  const [expirationOption, setExpirationOption] = useState<ExpirationOption>(
    expirationOptions[5]
  )
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')
  const imageSize = singleColumnBreakpoint ? 533 : 250
  const priceUsdConversion = useCoinConversion('usd', 'eth')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const nftPriceRef = useRef<number>(0)
  const typedData = useRef<any>(null)

  const nftPrice = nftPriceRef.current

  // const nftPriceWei = ethers.utils.parseUnits(nftPrice.toString(), 18)
  const potFee = tradeFee && tradeFee / 100
  // const estimatePrice = nftPrice - 0.1 * nftPrice
  // const feePercentage = 10 // 10% fee
  const listPrice = new Decimal(nftPrice)
  const tradeFeeD = new Decimal(tradeFee || 0)
  const hotpotFee = tradeFeeD.dividedBy(10000)
  const royalty = new Decimal('0')
  //Estimate Price is shown in ui
  const estimatePrice = tradeFee && nftPrice - (tradeFee / 10000) * nftPrice

  //Total Price Wei send to BE
  const totalPrice = listPrice.minus(hotpotFee.plus(royalty).times(listPrice))
  const totalPriceWei = ethers.utils.parseEther(totalPrice.toString())

  const formattedEstimate = formatBN(estimatePrice, 3, 18)

  let expirationTime: string | null = null

  if (expirationOption.relativeTime && expirationOption.relativeTimeUnit) {
    expirationTime = dayjs()
      .add(expirationOption.relativeTime, expirationOption.relativeTimeUnit)
      .unix()
      .toString()
  }

  const salt = Math.floor(Math.random() * 1000)

  //Royalties- untested
  const { data: onChainRoyalties, isFetching: isFetchingOnChainRoyalties } =
    useOnChainRoyalties({
      contract: tokenDetails?.collection?.id,
      tokenId: tokenDetails?.tokenId,
      chainId: 1,
      enabled: true,
    })

  let royaltyBps = 0

  const onChainRoyaltyBps = useMemo(() => {
    const totalRoyalty = onChainRoyalties?.[1].reduce((total, royalty) => {
      total += parseFloat(ethers.utils.formatUnits(royalty))
      return total
    }, 0)
    if (totalRoyalty) {
      return (totalRoyalty / 1) * 10000
    }
    return 0
  }, [onChainRoyalties])

  if (onChainRoyaltyBps) {
    royaltyBps = onChainRoyaltyBps
  }

  //Typed Data Variables
  const domain = {
    name: 'Hotpot',
    version: '0.1.0',
    chainId: activeChain?.id,
    verifyingContract: MARKET_CONTRACT_G,
  } as const

  const value = {
    offerer: account?.address,
    offerItem: {
      offerToken: tokenDetails?.contract,
      offerTokenId: tokenDetails?.tokenId,
      offerAmount: totalPriceWei,
      endTime: expirationTime,
    },
    royalty: {
      royaltyPercent: 0,
      royaltyRecipient: '0x7092E63D04930fa96cD9912760500B5f21c9Aa8a',
    },
    salt: salt,
  } as const

  const { signTypedDataAsync } = useSignTypedData({
    domain,
    types,
    value,
    onMutate(args) {
      typedData.current = args
    },
  })

  const NFTMarketplace = useContract({
    address: MARKET_CONTRACT_G,
    abi: MARKET_ABI_G,
    signerOrProvider: signer || provider,
  })

  const NFT = useContract({
    address: collectionId,
    abi: ERC721abi,
    signerOrProvider: signer || provider,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceValue = Number(e.target.value)

    if (newPriceValue <= 0) {
      setAlert('Price must be greater than 0.')
    } else {
      setAlert(null)
    }
    if (newPriceValue < 0.00001) {
      setAlert('Price must be greater than  0.00001')
      return null
    }
    setPriceValue(newPriceValue)
    nftPriceRef.current = newPriceValue
  }

  const usdPrice =
    priceUsdConversion && estimatePrice
      ? priceUsdConversion * estimatePrice
      : null

  //Listing Request to Backend
  const handlePostRequest = async (sign: string) => {
    try {
      if (typedData.current) {
        const orderData = {
          order: {
            offerer: typedData.current.value.offerer,
            offer_item: {
              offer_token: typedData.current.value.offerItem.offerToken,
              offer_token_id: parseInt(
                typedData.current.value.offerItem.offerTokenId
              ),
              offer_amount: parseInt(
                typedData.current.value.offerItem.offerAmount
              ),
              end_time: parseInt(typedData.current.value.offerItem.endTime),
            },
            royalty: {
              royalty_percent: typedData.current.value.royalty.royaltyPercent,
              royalty_recipient:
                typedData.current.value.royalty.royaltyRecipient,
            },
            salt: parseInt(typedData.current.value.salt),
          },
          signature: sign,
        }

        const req = JSON.stringify(orderData)

        // Post Request
        const requestOptions = {
          method: 'POST',
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
      throw error
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setStep(2)
    setError(null)

    try {
      if (!NFTMarketplace) {
        console.log('NFTMarketplace contract instance is not available.')
        return
      }
      if (!NFT) {
        console.log('NFT contract instance is not available.')
        return
      }
      if (!tradeFee) {
        console.log('Trade Fee is not available.')
        return
      }
      // Obtain domain separator from marketplace contract
      // const domainSeparator = await NFTMarketplace.DOMAIN_SEPARATOR()

      // Check if Hotpot is already approved to manage all of the owner's tokens
      const isAlreadyApproved = await NFT.isApprovedForAll(
        account.address,
        NFTMarketplace.address
      )
      // If not approved, call the `setApprovalForAll` function on the NFT contract
      if (!isAlreadyApproved) {
        const approvalTx = await NFT.setApprovalForAll(
          NFTMarketplace.address,
          true
        )
        console.log('Approval Transaction Hash >>', approvalTx.hash)
        await approvalTx.wait() // Wait for the approval transaction to be confirmed
      }

      // EIP712-signs all the order data && send to backend
      const sign = await signTypedDataAsync()

      if (sign) {
        setIsApproved(true)

        //Order Hash
        const orderHash = ethers.utils._TypedDataEncoder.hash(
          typedData.current.domain,
          typedData.current.types,
          typedData.current.value
        )

        try {
          setIsApproved(false)
          const res = await handlePostRequest(sign)

          if (res) {
            if (res.ok) {
              setIsLoading(false)
              setStep(3)
              setToast({
                kind: 'success',
                message: 'Your item was listed successfully',
                title: 'Success!',
              })

              console.log('Success response:', res.status, res.statusText)
            } else {
              setIsLoading(false)
              setError(new Error('Already listed'))
              console.error('Error response:', res.status, res.statusText)
            }
          } else {
            setIsLoading(false)
            setError(new Error('An unknown error occurred.'))
          }
        } catch (error) {
          setIsLoading(false)
          console.error('Error in postRequest', error)
          setError(new Error('An unknown error occurred.'))
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error)
      if (error instanceof Error) {
        setError(error)
        setIsLoading(false)
      } else {
        setError(new Error('An unknown error occurred.'))
        setIsLoading(false)
      }
    }
  }

  const onEdit = () => {
    setStep(1)
    setError(null)
    setAlert(null)
    setPriceValue(0)
    setIsLoading(false)
  }

  const onClose = () => {
    setStep(0)
    setError(null)
    setExpirationOption(expirationOptions[5])
    setAlert(null)
    setPriceValue(0)
    setIsLoading(false)
    if (mutate) {
      mutate()
    }
    if (mutateHotpot) {
      mutateHotpot()
    }
  }

  useEffect(() => {
    if (error && onListingError) {
      onListingError(error)
    }
  }, [error])

  const onNext = () => {
    setStep((value) => value + 1)
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.ListItem) {
      setIsLoading(true)
      return 'Waiting for Approval'
    }
    if (step === STEPS.Complete) {
      setIsLoading(false)
      return 'Close'
    }
    setIsLoading(false)
    return 'Next'
  }, [step])

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.ListItem) {
      return onEdit
    }
    return undefined
  }, [step])

  const primaryAction = useMemo(() => {
    if (isLoading) {
      return undefined
    }
    if (step === STEPS.Complete) {
      return onClose
    }
    if (error) {
      return handleSubmit
    }

    if (step === STEPS.SetPrice) {
      return handleSubmit
    }

    return onNext
  }, [step, isLoading, error, priceValue])

  if (!isMounted) {
    return null
  }

  const tix = useTix(priceValue ?? '0')

  let mainContent = (
    <div>
      <div className="mb-4 flex flex-row rounded border border-[#FFD027] bg-[#FFF1CC] py-2 px-2 text-sm font-normal dark:text-neutral-800">
        <img src="/eth-gold.svg" className="w-8 h-8" />
        <div className="text-sm font-normal reservoir-h6 text-neutral-800 dark:text-neutral-800">
          {' '}
          To ensure you{' '}
          <span className="font-medium text-[#FF991C]">
            earn golden tickets
          </span>{' '}
          to draw to win{' '}
          <span className="font-medium text-[#FF991C]">1 ETH</span>, list at the
          most competitive price on Hotpot.
        </div>
      </div>
      <div className="text-base font-semibold text-gray-900 reservoir-h6 dark:text-neutral-300">
        List your NFT
      </div>
      <div>
        <div className="mt-4 text-sm font-medium text-gray-500 reservoir-h6 dark:text-gray-300">
          List on Hotpot and earn raffle tickets
        </div>
        <div className="text-md mt-2 flex flex-row justify-between rounded-lg border border-[#620DED] px-3 py-2 font-medium">
          <div className="flex flex-row items-center justify-center gap-2 text-gray-700 reservoir-h6 dark:text-white">
            <img src="/hotpot.png" className="w-8 h-8" />
            <div>Hotpot</div>
          </div>
          <div
            className="flex items-center"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <label
              className="reservoir-h6 text-[14px] font-medium leading-none text-gray-700 dark:text-white"
              htmlFor="hotpot-marketplace"
            >
              {potFee}% goes to the{' '}
              <span className="text-[14px] text-[#620DED] dark:text-violet-600">
                Pot O' Gold
              </span>
            </label>
          </div>
        </div>
        <div className="reservoir-h6 mt-5 flex w-full flex-col gap-2.5  text-sm font-normal text-[#909090]">
          <div className="flex flex-row justify-between ">
            <div className=" flex flex-row items-center justify-center gap-1.5 ">
              <img src="/rarible-gray.png" className="w-6 h-6 text-gray-500 " />
              <h6>Rarible</h6>
            </div>
            <div>2.0%</div>
          </div>
          <div className="flex flex-row justify-between ">
            <div className=" flex flex-row items-center justify-center gap-1.5 ">
              <img src="/opensea-gray.png" className="w-6 h-6" />
              <h6>Opensea</h6>
            </div>
            <div>2.5%</div>
          </div>
          <div className="flex flex-row justify-between ">
            <div className=" flex flex-row items-center justify-center gap-1.5 ">
              <img src="/blur-gray.png" className="w-6 h-6" />
              <h6>Blur</h6>
            </div>
            <div>0.5%</div>
          </div>
        </div>
      </div>
    </div>
  )

  let sideContent = (
    <div className="grid gap-1 mt-2 grid-row">
      <div className="hidden flex-row justify-between rounded bg-[#F3F2F2] p-2 dark:bg-neutral-700 md:flex">
        <div className="flex flex-row gap-1 text-sm text-gray-600 dark:text-neutral-300 ">
          <div>Creator Royalties</div>
          <InfoTooltip
            side="top"
            width={200}
            content="A fee on every order that goes to the collection creator."
          />
        </div>
        <div className="text-xs font-semibold text-gray-600 dark:text-neutral-300 ">
          {royaltyBps}%
        </div>
      </div>
      <div className="flex flex-row justify-between rounded bg-[#F3F2F2] p-2  dark:bg-neutral-700">
        <div className="text-sm text-gray-600 dark:text-neutral-300 ">
          Last Sale
        </div>
        <div className="text-sm text-gray-600 dark:text-neutral-300 ">-</div>
      </div>
      <div className="flex flex-row justify-between rounded bg-[#F3F2F2] p-2  dark:bg-neutral-700">
        <div className="text-sm text-gray-600 dark:text-neutral-300 ">
          Collection Floor
        </div>
        <div className="text-sm ">-</div>
      </div>
      <div className="hidden flex-row justify-between rounded bg-[#F3F2F2] p-2  dark:bg-neutral-700 md:flex">
        <div className="flex flex-row gap-1 text-sm text-gray-600 dark:text-neutral-300 ">
          <div>Highest Trait Floor</div>
          <InfoTooltip
            side="top"
            width={200}
            content="The floor price of the most valuable trait of a token."
          />
        </div>
        <div className="text-sm ">-</div>
      </div>
    </div>
  )

  if (step === STEPS.SetPrice) {
    mainContent = (
      <div>
        {' '}
        <div>
          <div className="mt-4 text-base font-semibold text-gray-900 reservoir-h6 dark:text-neutral-300 ">
            Set Your Price
          </div>
          <div>
            <div className="flex flex-row justify-between mt-4 ">
              <div className="text-sm font-medium text-gray-500 reservoir-h6 dark:text-neutral-300">
                List Price
              </div>
              <div className="flex flex-row items-center justify-center gap-2">
                {tix > 0 && (
                  <div className="z-10 flex items-center justify-center truncate rounded border border-[#0FA46E] bg-[#DBF1E4] px-2 text-sm font-normal text-[#0FA46E] dark:bg-neutral-800">
                    +{tix} TIX
                  </div>
                )}
                <div className="hidden text-sm font-medium text-gray-500 reservoir-h6 dark:text-neutral-300 md:block">
                  Profit
                </div>
                <div className="hidden md:flex">
                  <InfoTooltip
                    side="top"
                    width={200}
                    content="How much you will receive"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between mt-2 text-md">
              <div className="flex flex-row items-center gap-2 text-gray-700 dark:text-white ">
                <div className="flex items-center">
                  <img
                    src="/hotpot.png"
                    className="flex-none w-5 h-5 mr-4 md:h-8 md:w-8"
                  />
                  <img src="/eth.png" className="w-4 h-4 mr-1" alt="price" />
                  <div className="hidden md:flex">ETH</div>
                </div>
              </div>
              <input
                disabled={false}
                onChange={handleChange}
                type="number"
                placeholder="Enter a listing price"
                className="px-2 py-2 mx-2 text-sm font-light border-2 rounded grow dark:bg-neutral-800 md:px-4"
              />
              <div className="flex-col items-end justify-center hidden md:flex ">
                <div className="flex flex-row justify-end">
                  <img src="/eth.png" className="w-3 h-3 mr-1" alt="price" />
                  <label
                    className="grow-0 truncate text-[14px] font-medium leading-none text-gray-700 dark:text-white "
                    htmlFor="hotpot-marketplace"
                  >
                    {formattedEstimate.toString()}
                  </label>
                </div>
                {priceValue > 0 && (
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-300 ">
                    {formatDollar(usdPrice)}
                  </div>
                )}
              </div>
            </div>
            <div className="items-center justify-center p-1 text-xs font-light text-red-500">
              {alert}
            </div>

            {/* Profit - mobile  */}
            <div className="flex flex-row items-center justify-between px-2 py-2 md:hidden">
              <div className="flex flex-row gap-1">
                {' '}
                <div className="text-sm font-medium text-gray-500 reservoir-h6 dark:text-neutral-300 ">
                  Profit
                </div>
                <InfoTooltip
                  side="top"
                  width={200}
                  content="How much you will receive"
                />
              </div>
              <div className="flex flex-col items-end justify-center ">
                <div className="flex flex-row justify-end">
                  <img src="/eth.png" className="w-3 h-3 mr-1" alt="price" />
                  <label
                    className="grow-0 truncate text-[14px] font-medium leading-none text-gray-700 dark:text-white "
                    htmlFor="hotpot-marketplace"
                  >
                    {formattedEstimate.toString()}
                  </label>
                </div>
                {priceValue > 0 && (
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-300 ">
                    {formatDollar(usdPrice)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center mt-4 items-left active:none">
              <div className="text-sm font-medium text-gray-500 reservoir-h6 dark:text-neutral-300">
                Expiration Date
              </div>
              <Select.Root
                value={expirationOption?.value || ''}
                onValueChange={(value: string) => {
                  const option = expirationOptions.find(
                    (option) => option.value === value
                  )
                  if (option) {
                    setExpirationOption(option)
                  }
                }}
              >
                <Select.Trigger className="flex items-center justify-between gap-1 px-4 py-2 mt-2 border-2 border-gray-200 border-solid rounded">
                  <div className="text-base font-normal">
                    <span>{expirationOption.text}</span>
                  </div>
                  <CgChevronDown className="text-gray-500" />
                </Select.Trigger>

                <Select.Content className="items-left no-scrollbar max-h-[280px] w-[250px] translate-y-[-50px] overflow-y-auto rounded border-2 border-blue-700 bg-white dark:border-neutral-800 dark:bg-neutral-900 md:w-[460px] md:translate-y-[130px]">
                  {expirationOptions.map((option) => (
                    <Select.Item key={option.text} value={option.value}>
                      <div className="flex items-center px-4 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700">
                        {option.text}
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === STEPS.ListItem) {
    ;(mainContent = (
      <div>
        <div>
          <div className="flex flex-wrap justify-between w-full my-4">
            <div className="w-[48%] rounded border-2 border-[#7000FF]" />
            <div className="w-[48%] rounded border-2 border-gray-500" />
          </div>

          <div className="flex flex-col items-center justify-center gap-10 mt-10">
            {error && (
              <div className="flex flex-row items-center justify-center gap-2 px-10 py-2 text-xs font-medium text-gray-500 bg-gray-100 border rounded-md">
                <HiExclamationCircle className="w-4 h-4 text-red-500" />
                <div>Oops! Something went wrong</div>
              </div>
            )}
            <h1 className="font-semibold text-md">
              {isApproved
                ? 'Confirmed!'
                : 'Confirm listing on Hotpot in your wallet'}
            </h1>

            <div className="flex flex-row items-center justify-center gap-5">
              {tokenDetails?.image ? (
                <div className="object-fill rounded-sm w-14">
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
                <img src="/hotpot.png" className="h-14 w-14" />
              )}
              <div>
                <CgMore className={`h-4 w-4 ${error ? '' : 'animate-ping'}`} />
              </div>
              <img src="/hotpot.png" className="h-14 w-14" />
            </div>
            <div className="text-sm font-light text-gray-500 dark:text-neutral-300">
              {isApproved
                ? 'Verifying your transaction'
                : 'A free off-chain signature to create the listing'}
            </div>
          </div>
        </div>
      </div>
    )),
      (sideContent = (
        <div className="grid gap-1 mt-2 grid-row">
          <div className="flex flex-row justify-between rounded bg-[#F3F2F2] p-2 dark:bg-neutral-700">
            <div className="flex flex-row gap-1 text-sm text-gray-600 dark:text-neutral-300">
              <div className="flex flex-col gap-1 items-left">
                <div className="flex flex-row items-center">
                  <img src="/eth.png" className="w-3 h-3 mr-2" alt="price" />
                  <div className="text-sm font-semibold">{priceValue}</div>
                </div>
              </div>
            </div>
            <img src="/hotpot.png" className="w-6 h-6" />
          </div>
        </div>
      ))
  }

  if (step === STEPS.Complete) {
    ;(mainContent = (
      <div>
        {' '}
        <div>
          <div className="flex flex-wrap justify-between w-full my-4">
            <div className="w-[48%] rounded border-2 border-[#7000FF]" />
            <div className="w-[48%] rounded border-2 border-[#7000FF]" />
          </div>

          <div className="relative flex flex-col items-center justify-center gap-2 mt-10">
            <div className="absolute inset-0 z-10 flex items-center justify-center mt-6 transform scale-100">
              <img src="/success.gif" className="object-cover" />
            </div>
            <HiCheckCircle className="h-[100px] w-[3100px] items-center justify-center text-green-700" />
            <h1 className="text-xl font-semibold">
              Your item has been listed!
            </h1>
            <div className="px-10 text-sm text-center text-gray-500 dark:text-neutral-300">
              <span className="text-[#7000FF] dark:text-violet-500">
                {' '}
                {tokenDetails?.name || tokenDetails?.tokenId}
              </span>{' '}
              from{' '}
              <span className="text-[#7000FF] dark:text-violet-500">
                {' '}
                {tokenDetails?.collection?.name}
              </span>{' '}
              has been listed for sale
            </div>

            <div className="z-20 mt-4 text-xs font-light text-gray-400 bg-white dark:bg-neutral-800">
              <Dialog.Close asChild>
                <Link
                  href={`/${tokenDetails?.collection?.id}/${tokenDetails?.tokenId}`}
                >
                  {' '}
                  <a
                    href={`/${tokenDetails?.collection?.id}/${tokenDetails?.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2"
                  >
                    View Listing on
                    <img src="/hotpot.png" className="w-6 h-6" />
                  </a>
                </Link>
              </Dialog.Close>
            </div>
          </div>
        </div>
      </div>
    )),
      (sideContent = (
        <div className="grid gap-1 mt-2 grid-row">
          <div className="flex flex-row justify-between rounded bg-[#F3F2F2] p-2 dark:bg-neutral-700">
            <div className="flex flex-row gap-1 text-sm text-gray-600 dark:text-neutral-300">
              <div className="flex flex-col gap-1 items-left">
                <div className="flex flex-row items-center">
                  <img src="/eth.png" className="w-3 h-3 mr-2" alt="price" />
                  <div className="text-sm font-semibold">{priceValue}</div>
                </div>
              </div>
            </div>
            <img src="/hotpot.png" className="w-6 h-6" />
          </div>
        </div>
      ))
  }

  return (
    <Modal trigger={trigger}>
      <Dialog.Content className="fixed bottom-0 left-[50%] mt-10 w-[99vw] translate-x-[-50%] bg-white pb-4  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] transition-transform focus:outline-none dark:bg-neutral-800 dark:text-white dark:ring-1 dark:ring-neutral-400  md:bottom-auto md:top-[50%] md:w-[90vw] md:max-w-[750px] md:translate-y-[-50%] md:rounded data-[state=open]:md:animate-contentShow">
        <div className="flex flex-row justify-between rounded-t bg-[#F8F8F8] p-4 dark:bg-[#262A2B]">
          {' '}
          <Dialog.Title>
            <h2 className="m-0 font-semibold text-gray-900 text-md dark:text-white">
              List Item for sale
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
        <div className="m-2 flex flex-grow flex-col md:min-h-[400px] md:flex-grow md:flex-row">
          <section className="flex flex-col gap-1 p-2 md:w-1/3 md:flex-col md:border-r">
            <div className="text-sm text-gray-500 dark:text-neutral-300">
              Item
            </div>
            <div className="flex flex-row gap-2 md-gap-0 md:flex-col">
              {tokenDetails?.image ? (
                <div className="max-h-[200px] w-[80px] overflow-hidden rounded-sm object-cover p-4 md:w-full">
                  <Image
                    loader={({ src, width }) => {
                      return `${src}?w=${width}`
                    }}
                    src={optimizeImage(tokenDetails?.image, imageSize)}
                    alt={`${tokenDetails?.name}`}
                    className="w-full overflow-hidden h-14"
                    width={imageSize}
                    height={imageSize}
                    objectFit="cover"
                    layout="responsive"
                  />
                </div>
              ) : (
                <img
                  src="/hotpot.png"
                  className="w-[60px] rounded-sm object-fill md:w-[180px]"
                />
              )}
              <div>
                <h1 className="font-semibold truncate text-md">
                  {' '}
                  {tokenDetails?.name || tokenDetails?.tokenId}
                </h1>
                <p className="text-sm text-gray-500 truncate dark:text-neutral-300">
                  {' '}
                  {tokenDetails?.collection?.name}
                </p>
              </div>
            </div>
            {sideContent}
          </section>
          <main className="flex flex-col justify-between px-4 md:w-2/3">
            {mainContent}
            <div className="mt-[25px] flex justify-end gap-4">
              {!isLoading &&
                error &&
                step === STEPS.ListItem &&
                secondaryActionLabel && (
                  <button
                    onClick={onEdit}
                    className="w-full py-2 text-black bg-white border border-black rounded hover:bg-gray-100 dark:border-0 dark:bg-black dark:text-white dark:ring-1 dark:ring-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Edit List
                  </button>
                )}

              {step !== STEPS.Complete && (
                <button
                  onClick={primaryAction}
                  disabled={
                    isLoading ||
                    (step === STEPS.SetPrice && priceValue <= 0) ||
                    !tradeFee ||
                    alert !== null
                  }
                  className={`w-full rounded py-2 text-white ${
                    isLoading || (step === STEPS.SetPrice && priceValue <= 0)
                      ? 'cursor-not-allowed bg-[#7000FF]'
                      : 'cursor-pointer bg-[#7000FF] hover:bg-[#430099]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <CgSpinner className="inline-block w-6 h-6 mr-2 animate-spin" />
                      {isApproved
                        ? 'Waiting to be Validated'
                        : 'Waiting for Approval'}
                    </>
                  ) : error ? (
                    'Retry'
                  ) : (
                    actionLabel
                  )}
                </button>
              )}

              {step === STEPS.Complete && (
                <Dialog.Close asChild>
                  <button
                    onClick={onClose}
                    className="w-full cursor-pointer rounded bg-[#7000FF] py-2 text-white hover:bg-[#430099]"
                  >
                    Close
                  </button>
                </Dialog.Close>
              )}
            </div>
          </main>
        </div>
      </Dialog.Content>
    </Modal>
  )
}

export default ListModal
