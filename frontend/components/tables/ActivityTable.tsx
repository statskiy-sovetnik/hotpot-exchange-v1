import { optimizeImage } from 'lib/optmizeImage'
import { truncateAddress } from 'lib/truncateText'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { FC, ReactElement, useEffect, useState } from 'react'
import Image from 'next/legacy/image'
import { useMediaQuery } from '@react-hookz/web'
import LoadingIcon from 'components/LoadingIcon'
import { FiExternalLink, FiRepeat, FiTrash2, FiXSquare } from 'react-icons/fi'
import useEnvChain from 'hooks/useEnvChain'
import { useAccount } from 'wagmi'
import { constants, ethers } from 'ethers'
import { FaSeedling } from 'react-icons/fa'
import FormatNativeCrypto from 'components/FormatNativeCrypto'
import {
  useCollectionActivity,
  useUsersActivity,
} from '@reservoir0x/reservoir-kit-ui'
import { useInView } from 'react-intersection-observer'
import MobileActivityFilter from 'components/filter/MobileActivityFilter'
import { HotpotListing } from 'types/hotpot'
import { useRouter } from 'next/router'
import useTransactionData from 'hooks/useTransactionData'
import useTix from 'lib/tix'

const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
type CollectionActivityResponse = ReturnType<typeof useCollectionActivity>
type CollectionActivity = CollectionActivityResponse['data'][0]
export type CollectionActivityTypes = NonNullable<
  Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
>['types']

type UsersActivityResponse = ReturnType<typeof useCollectionActivity>
type UsersActivity = UsersActivityResponse['data'][0]
type ActivityResponse = CollectionActivityResponse | UsersActivityResponse
export type UserActivityTypes = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>['types']

type Activity = CollectionActivity | UsersActivity
type ActivityTypes = Exclude<
  CollectionActivityTypes | UserActivityTypes,
  string
>

type Props = {
  data: ActivityResponse
  types: ActivityTypes
  onTypesChange: (types: ActivityTypes) => void
  emptyPlaceholder: ReactElement
  hotpotListing?: HotpotListing[]
  url: string
}

const ActivityTable: FC<Props> = ({
  data,
  types,
  onTypesChange,
  emptyPlaceholder,
}) => {
  const headings = ['Event', 'Item', 'Amount', 'From', 'To', 'Rewards', 'Time']
  const isMobile = useMediaQuery('only screen and (max-width : 730px)')
  const filters = ['Sales', 'Listings', 'Transfer', 'Mints']
  const router = useRouter()
  const user = router.query?.address?.toString()

  const enabledFilters: typeof filters = []
  if (types?.includes('sale')) {
    enabledFilters.push('Sales')
  }
  if (types?.includes('ask')) {
    enabledFilters.push('Listings')
  }
  if (types?.includes('transfer')) {
    enabledFilters.push('Transfer')
  }
  if (types?.includes('mint')) {
    enabledFilters.push('Mints')
  }

  const { ref, inView } = useInView()

  const activities = data.data
  useEffect(() => {
    if (inView) data.fetchNextPage()
  }, [inView])

  return (
    <>
      {!data.isValidating && (!activities || activities.length === 0) ? (
        emptyPlaceholder
      ) : (
        <table className="w-full">
          {!isMobile && (
            <thead>
              <tr className="text-left">
                {headings.map((name, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-sm font-medium text-left text-neutral-600 dark:text-white"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {activities.map((activity, i) => {
              if (!activity) return null

              return (
                <ActivityTableRow
                  key={`${activity?.txHash}-${i}`}
                  activity={activity}
                  user={user}
                />
              )
            })}
            <tr ref={ref}></tr>
          </tbody>
        </table>
      )}

      {data.isValidating && (
        <div className="flex justify-center my-20">
          <LoadingIcon />
        </div>
      )}
    </>
  )
}

type ActivityTableRowProps = {
  activity: Activity

  user?: string
}

const ActivityTableRow: FC<ActivityTableRowProps> = ({
  activity,

  user,
}) => {
  const isMobile = useMediaQuery('only screen and (max-width : 730px)')
  const { address } = useAccount()
  const [toShortAddress, setToShortAddress] = useState<string>(
    activity?.toAddress || ''
  )

  const [fromShortAddress, setFromShortAddress] = useState<string>(
    activity?.fromAddress || ''
  )
  const [imageSrc, setImageSrc] = useState(
    activity?.token?.tokenImage ||
      `${RESERVOIR_API_BASE}/redirect/collections/${activity?.collection?.collectionImage}/image/v1`
  )

  const [isLoading, setIsLoading] = useState(true)
  const { data: hotpot } = useTransactionData(activity?.txHash || '')

  const [timeAgo, setTimeAgo] = useState(activity?.timestamp || '')
  const envChain = useEnvChain()

  const hotpotSellPrice = ethers.utils.formatEther(
    hotpot?.order?.tradeAmount || '0'
  )

  const hotpotBuyPrice = ethers.utils.formatEther(
    hotpot?.order?.tradeAmount || '0'
  )

  const isSale =
    activity?.fromAddress?.toLowerCase() ===
      hotpot?.tickets?._seller.toLowerCase() &&
    hotpot?.tickets?._seller.toLowerCase() === user?.toLowerCase()

  const isBuy =
    activity?.fromAddress?.toLowerCase() ===
      hotpot?.tickets?._seller.toLowerCase() &&
    hotpot?.tickets?._buyer.toLowerCase() === user?.toLowerCase()

  const sellerTix = useTix(hotpotSellPrice ?? '0')
  const buyerTix = useTix(hotpotBuyPrice ?? '0')

  const blockExplorerBaseUrl =
    envChain?.blockExplorers?.default?.url || 'https://etherscan.io'
  const href = activity?.token?.tokenId
    ? `/${activity?.collection?.collectionId}/${activity?.token?.tokenId}`
    : `/collections/${activity?.collection?.collectionId}`

  useEffect(() => {
    let toShortAddress = truncateAddress(activity?.toAddress || '')
    let fromShortAddress = truncateAddress(activity?.fromAddress || '')
    if (!!address) {
      if (address?.toLowerCase() === activity?.toAddress?.toLowerCase()) {
        toShortAddress = 'You'
      }
      if (address?.toLowerCase() === activity?.toAddress?.toLowerCase()) {
        toShortAddress = 'You'
      }
      if (address?.toLowerCase() === activity?.fromAddress?.toLowerCase()) {
        fromShortAddress = 'You'
      }
    }
    setToShortAddress(toShortAddress)
    setFromShortAddress(fromShortAddress)
    setTimeAgo(
      activity?.timestamp
        ? DateTime.fromSeconds(activity.timestamp).toRelative() || ''
        : ''
    )
  }, [activity, address])
  useEffect(() => {
    if (activity?.token?.tokenImage) {
      setImageSrc(optimizeImage(activity?.token?.tokenImage, 48))
    } else if (activity?.collection?.collectionImage) {
      setImageSrc(optimizeImage(activity?.collection?.collectionImage, 48))
    }
  }, [activity])

  if (!activity) {
    return null
  }

  let activityDescription = ''

  const logos = {
    transfer: (
      <FiRepeat className="w- mr-1 h-4 w-4 text-neutral-400 md:mr-[10px] md:h-5 md:w-5" />
    ),
    mint: (
      <FaSeedling className="mr-1 h-4 w-4 text-neutral-400 md:mr-[10px] md:h-5 md:w-5" />
    ),
    burned: (
      <FiTrash2 className="mr-1 h-4 w-4 text-neutral-400 md:mr-[10px] md:h-5 md:w-5" />
    ),
    listing_canceled: (
      <FiXSquare className="mr-1 h-4 w-4 text-neutral-400 md:mr-[10px] md:h-5 md:w-5" />
    ),
    ask: null,
    bid: null,
  }

  if (
    activity?.fromAddress?.toLowerCase() ===
      hotpot?.tickets?._seller.toLowerCase() &&
    activity?.fromAddress?.toLowerCase() === user?.toLowerCase()
  ) {
    activityDescription = 'Sell'
    logos.transfer = <img src="/hotpot.png" className="w-6 h-6 mr-2" />
  } else if (
    activity?.fromAddress?.toLowerCase() ===
      hotpot?.tickets?._seller.toLowerCase() &&
    activity?.toAddress?.toLowerCase() === user?.toLowerCase()
  ) {
    activityDescription = 'Buy'
    logos.transfer = <img src="/hotpot.png" className="w-6 h-6 mr-2" />
  } else {
    switch (activity?.type) {
      case 'ask_cancel': {
        activityDescription = 'Listing Canceled'
        break
      }
      case 'mint': {
        activityDescription = 'Mint'
        break
      }
      case 'ask': {
        activityDescription = 'Listing'
        break
      }
      case 'transfer': {
        activityDescription = 'Transfer'
        break
      }
      case 'sale': {
        activityDescription = 'Sale'
        break
      }
      default: {
        if (activity.type) activityDescription = activity.type
        break
      }
    }
  }
  const tokenId = activity?.token?.tokenId
  const contract = activity?.collection?.collectionId

  if (isMobile) {
    return (
      <tr
        key={activity.txHash}
        className="h-24 border-b border-gray-300 dark:border-[#525252]"
      >
        <td className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center mt-6">
              {/* @ts-ignore */}
              {activity.type && logos[activity.type]}
              {!!activity.order?.source?.icon && (
                <img
                  className="inline w-3 h-3 mr-2"
                  // @ts-ignore
                  src={activity.order?.source?.icon || ''}
                  alt={`${activity.order?.source?.name} Source`}
                />
              )}
              <span className="text-sm capitalize text-neutral-600 dark:text-neutral-300">
                {activityDescription}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center mt-6">
              {' '}
              {isBuy && hotpotBuyPrice && buyerTix !== 0 ? (
                <>
                  <div className="rounded border border-[#0FA46E] bg-[#DBF1E4] px-1 text-xs text-[#0FA46E] dark:bg-black">
                    {buyerTix === 1 ? '+1 TIX' : `+${buyerTix} TIX`}
                  </div>
                </>
              ) : (
                <>
                  {isSale && hotpotSellPrice && sellerTix !== 0 ? (
                    <>
                      <div className="rounded border border-[#0FA46E] bg-[#DBF1E4] px-1 text-xs text-[#0FA46E] dark:bg-black">
                        {sellerTix === 1 ? '+1 TIX' : `+${sellerTix} TIX`}
                      </div>
                    </>
                  ) : (
                    '-'
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href={href} passHref legacyBehavior={true}>
              <a className="flex items-center">
                <Image
                  className="object-cover rounded"
                  loader={({ src, width }) => {
                    return `${src}?w=${width}`
                  }}
                  src={imageSrc}
                  alt={`${activity.token?.tokenName} Token Image`}
                  width={48}
                  height={48}
                />
                <div className="grid ml-2">
                  <div className="truncate reservoir-h6 dark:text-white">
                    {activity.token?.tokenName ||
                      activity.token?.tokenId ||
                      activity.collection?.collectionName}
                  </div>
                </div>
              </a>
            </Link>

            {/* {activity.price &&
            activity.price !== 0 &&
            activity.type &&
            !['transfer', 'mint'].includes(activity.type) ? (
              <FormatNativeCrypto amount={activity.price} />
            ) : null}
          </div> */}
            {isBuy ? (
              <FormatNativeCrypto amount={parseFloat(hotpotBuyPrice)} />
            ) : (
              <>
                {activity.price &&
                activity.price !== 0 &&
                activity.type &&
                !['transfer', 'mint'].includes(activity.type) ? (
                  <>
                    <FormatNativeCrypto amount={activity.price} />
                  </>
                ) : (
                  <>
                    {isSale ? (
                      <FormatNativeCrypto
                        amount={parseFloat(hotpotSellPrice)}
                      />
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="reservoir-small">
              <span className="mr-1 font-light text-neutral-600 dark:text-neutral-300">
                From
              </span>
              {activity.fromAddress &&
              activity.fromAddress !== constants.AddressZero ? (
                <Link
                  href={`/address/${activity.fromAddress}`}
                  legacyBehavior={true}
                >
                  <a className="font-light text-primary-700 dark:text-primary-300">
                    {fromShortAddress}
                  </a>
                </Link>
              ) : (
                <span className="font-light">-</span>
              )}
              <span className="mx-1 font-light text-neutral-600 dark:text-neutral-300">
                to{' '}
              </span>
              {activity.toAddress &&
              activity.toAddress !== constants.AddressZero ? (
                <Link
                  href={`/address/${activity.toAddress}`}
                  legacyBehavior={true}
                >
                  <a className="font-light text-primary-700 dark:text-primary-300">
                    {toShortAddress}
                  </a>
                </Link>
              ) : (
                <span className="font-light">-</span>
              )}
              <div className="flex items-center justify-between gap-2 mb-4 font-light text-neutral-600 dark:text-neutral-300 md:justify-start">
                {timeAgo}
              </div>
            </div>

            {activity.txHash && (
              <Link
                href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}
                legacyBehavior={true}
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 mb-4 font-light text-neutral-600 dark:text-neutral-300 md:justify-start"
                >
                  <FiExternalLink className="w-4 h-4 text-primary-700 dark:text-primary-300" />
                </a>
              </Link>
            )}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr
      key={activity.txHash}
      className="h-24 border-b border-gray-300 dark:border-[#525252]"
    >
      <td className="px-6 py-4">
        <div className="mr-2.5 flex items-center">
          {/* @ts-ignore */}
          {activity.type && logos[activity.type]}
          {!!activity.order?.source?.icon && (
            <img
              className="w-6 h-6 mr-2"
              // @ts-ignore
              src={activity.order?.source?.icon || ''}
              alt={`${activity.order?.source?.name} Source`}
            />
          )}
          <span className="text-base font-medium capitalize text-neutral-600 dark:text-neutral-300">
            {activityDescription}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <Link href={href} passHref legacyBehavior={true}>
          <a className="mr-2.5 flex items-center">
            <Image
              className="object-cover rounded-lg"
              loader={({ src, width }) => {
                return `${src}?w=${width}`
              }}
              src={imageSrc}
              alt={`${activity.token?.tokenName} Token Image`}
              width={50}
              height={50}
            />
            <div className="grid ml-2 ">
              <div className="text-base font-medium truncate reservoir-h6 dark:text-white">
                {activity.token?.tokenName ||
                  activity.token?.tokenId ||
                  activity.collection?.collectionName}
              </div>
            </div>
          </a>
        </Link>
      </td>
      <td className="py-2 pr-4">
        {isBuy ? (
          <div className="flex flex-row items-center justify-end gap-1 text-base font-medium">
            {hotpotBuyPrice.slice(0, 5)}
            <img src="/eth.png" alt="price" className="w-5 h-5" />
          </div>
        ) : (
          <>
            {activity.price &&
            activity.price !== 0 &&
            activity.type &&
            !['transfer', 'mint'].includes(activity.type) ? (
              <>
                <div className="flex flex-row items-center justify-end gap-1 text-base font-medium">
                  <span className="">{activity.price?.toString()}</span>
                  <img src="/eth.png" alt="price" className="w-5 h-5" />
                </div>
              </>
            ) : (
              <>
                {isSale ? (
                  <div className="flex flex-row items-center justify-end gap-1 text-base font-medium">
                    {hotpotSellPrice.slice(0, 5)}
                    <img src="/eth.png" alt="price" className="w-5 h-5" />
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </td>

      <td className="px-2 py-2">
        {activity.fromAddress &&
        activity.fromAddress !== constants.AddressZero ? (
          <Link href={`/address/${activity.fromAddress}`} legacyBehavior={true}>
            <a className="text-sm font-medium text-center text-primary-700 dark:text-primary-300">
              {fromShortAddress}
            </a>
          </Link>
        ) : (
          <span className="font-light text-center">-</span>
        )}
      </td>
      <td className="px-2 py-2">
        {activity.toAddress && activity.toAddress !== constants.AddressZero ? (
          <Link href={`/address/${activity.toAddress}`} legacyBehavior={true}>
            <a className="ml-2.5 mr-2.5 text-center text-sm font-medium text-primary-700 dark:text-primary-300">
              {toShortAddress}
            </a>
          </Link>
        ) : (
          <span className="ml-2.5 mr-2.5 font-light">-</span>
        )}
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center justify-center gap-2 font-light text-center whitespace-nowrap text-neutral-600 dark:text-neutral-300">
          {isBuy && hotpotBuyPrice && buyerTix !== 0 ? (
            <Ticket
              text={buyerTix === 1 ? '+1 Ticket' : `+${buyerTix} Tickets`}
            />
          ) : (
            <>
              {isSale && hotpotSellPrice && sellerTix !== 0 ? (
                <Ticket
                  text={sellerTix === 1 ? '+1 Ticket' : `+${sellerTix} Tickets`}
                />
              ) : (
                '-'
              )}
            </>
          )}
        </div>
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center justify-between gap-2 text-sm font-medium whitespace-nowrap text-neutral-600 dark:text-neutral-300">
          {timeAgo}
          {activity.txHash && (
            <Link
              href={`${blockExplorerBaseUrl}/tx/${activity.txHash}`}
              legacyBehavior={true}
            >
              <a target="_blank" rel="noopener noreferrer">
                <FiExternalLink className="w-4 h-4 text-primary-700 dark:text-primary-300" />
              </a>
            </Link>
          )}
        </div>
      </td>
    </tr>
  )
}

interface TicketProps {
  text: string
}
const Ticket: React.FC<TicketProps> = ({ text }) => {
  return (
    <div
      className={`reservoir-h1 mx-1 flex h-[45px] w-[85px] items-center justify-center whitespace-normal bg-[url('/ticket-earned.svg')] bg-no-repeat px-1 text-center text-xs font-medium text-[#FAF9FE]`}
    >
      {text}
    </div>
  )
}

export default ActivityTable
