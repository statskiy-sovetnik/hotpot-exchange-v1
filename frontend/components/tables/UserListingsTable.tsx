import {
  ComponentProps,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useSigner } from 'wagmi'
import Toast from 'components/Toast'
import CancelListing from 'components/CancelListing'
import FormatCrypto from 'components/FormatCrypto'
import useCoinConversion from 'hooks/useCoinConversion'
import { formatDollar } from 'lib/numbers'
import { useListings, useUserTokens } from '@reservoir0x/reservoir-kit-ui'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/router'
import * as Dialog from '@radix-ui/react-dialog'
import LoadingIcon from 'components/LoadingIcon'
import { useMediaQuery } from '@react-hookz/web'
import { HotpotListing } from 'types/hotpot'
import { ethers } from 'ethers'
import { paths } from '@reservoir0x/reservoir-sdk'
import useTokens from 'hooks/useTokens'
import CancelListingModal from 'components/modal/CancelListingModal'
import ButtonGradient from 'components/ButtonGradient'
import { toggleOnItem } from 'lib/router'

const API_BASE =
  process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'

type Props = {
  fallback: {
    tokens: paths['/users/{user}/tokens/v6']['get']['responses']['200']['schema']
  }
  owner: string
  hotpotListing?: HotpotListing[]
  isOwner: boolean
  url: string
  collectionIds?: string[]
  modal: {
    isInTheWrongNetwork: boolean | undefined
    setToast: (data: ComponentProps<typeof Toast>['data']) => any
  }
  showActive?: boolean
}

const UserListingsTable: FC<Props> = ({
  modal,
  collectionIds,
  showActive,
  isOwner,
  hotpotListing,
  fallback,
  url,
  owner,
}) => {
  const router = useRouter()
  const isMobile = useMediaQuery('only screen and (max-width : 730px)')
  const { address } = router.query
  const params: Parameters<typeof useListings>['0'] = {
    maker: address as string,
    includeCriteriaMetadata: true,
  }
  if (collectionIds) {
    params.contracts = collectionIds
  }
  const userTokensParams: Parameters<typeof useUserTokens>['1'] = {
    limit: 20,
    normalizeRoyalties: true,
  }
  const userTokens = useUserTokens(owner, userTokensParams, {
    fallbackData: [fallback.tokens],
    revalidateOnMount: false,
  })
  const {
    data: tokens,
    isFetchingInitialData,
    isFetchingPage,
    hasNextPage,
    fetchNextPage,
    mutate,
  } = userTokens
  const isEmpty = tokens.length === 0
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView])

  useEffect(() => {
    userTokens.mutate()
    mutate()
    return () => {
      userTokens.setSize(1)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  if (isFetchingInitialData) {
    return (
      <div className="flex justify-center my-20">
        <LoadingIcon />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto mb-11">
      {/* {!hotpotListing && (
        <div className="flex items-center rounded-lg bg-[#F5F5F5] p-4 text-sm dark:bg-[#262626]">
          <FiAlertCircle className="mr-2 h-4 w-4 shrink-0 text-[#A3A3A3] dark:text-white" />
          <span>
            An inactive listing is a listing of your NFT that was never canceled
            and is still fulfillable should that item be returned to your
            wallet.
          </span>
        </div>
      )} */}
      {hotpotListing?.length === 0 && (
        <div className="mt-[84px] flex flex-col items-center justify-center gap-6 text-xl font-semibold">
          <div className="text-2xl font-medium reservoir-h1">
            No listings found
          </div>
          <Link href={`/address/${owner}?tab=portfolio`} legacyBehavior={true}>
            <ButtonGradient>
              <span className="px-10">List on Hotpot</span>
            </ButtonGradient>
          </Link>
        </div>
      )}
      {isMobile
        ? hotpotListing &&
          hotpotListing.length > 0 && (
            <table className="min-w-full table-auto dark:divide-neutral-600">
              <thead className="bg-white dark:bg-black">
                {/* <tr>
                  {['Item', 'Price', 'Expiration', 'Marketplace'].map(
                    (item) => (
                      <th
                        key={item}
                        scope="col"
                        className="px-6 py-3 text-sm font-medium text-left text-neutral-600 dark:text-white"
                      >
                        {item}
                      </th>
                    )
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Cancel</span>
                  </th>
                </tr> */}
              </thead>
              <tbody>
                {hotpotListing.map((hotpotListing, index, arr) => (
                  <UserListingsMobileTableRow
                    key={`${hotpotListing?.end_time}-${index}`}
                    ref={index === arr.length - 5 ? ref : null}
                    hotpotListing={hotpotListing}
                    isOwner={isOwner}
                    tokens={tokens}
                    owner={owner}
                    url={url}
                  />
                ))}
              </tbody>
            </table>
          )
        : hotpotListing &&
          hotpotListing.length > 0 && (
            <table className="min-w-full table-auto dark:divide-neutral-600">
              <thead className="bg-white dark:bg-black">
                <tr>
                  {['Item', 'Price', 'Expiration', 'Marketplace'].map(
                    (item) => (
                      <th
                        key={item}
                        scope="col"
                        className="px-6 py-3 text-sm font-medium text-left text-neutral-600 dark:text-white"
                      >
                        {item}
                      </th>
                    )
                  )}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Cancel</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {hotpotListing
                  .slice()
                  .reverse()
                  .map((hotpotListing, index, arr) => (
                    <UserListingsTableRow
                      key={`${hotpotListing?.end_time}-${index}`}
                      ref={index === arr.length - 5 ? ref : null}
                      hotpotListing={hotpotListing}
                      isOwner={isOwner}
                      tokens={tokens}
                      owner={owner}
                      url={url}
                    />
                  ))}
              </tbody>
            </table>
          )}
    </div>
  )
}

type UserListingsRowProps = {
  hotpotListing: HotpotListing
  tokens: any[]
  url: string
  isOwner: boolean
  owner: any
  // modal: Props['modal']
  // mutate: ReturnType<typeof useHotpotListings>['mutate']
  ref: null | ((node?: Element | null) => void)
}

type tokenType = ReturnType<typeof useTokens>['tokens']['data'][0]
const UserListingsTableRow = ({
  hotpotListing,
  ref,
  isOwner,
  tokens,
  owner,
  url,
}: // isOwner,
// modal,
// mutate,
// ref,
UserListingsRowProps) => {
  const Contract = hotpotListing?.offer_token.toLowerCase()
  const TokenId = hotpotListing?.offer_token_id.toString()
  // Find the token that matches the contract
  const token = tokens?.find(
    (token: tokenType) =>
      token?.token?.contract === Contract && token?.token?.tokenId === TokenId
  )

  let tokenData = null
  if (token) {
    tokenData = {
      token: {
        contract: token?.token?.contract || '',
        tokenId: token?.token?.tokenId || '',
        owner,
        ...token?.token,
      },
      market: {
        floorAsk: { ...token?.ownership?.floorAsk },
        topBid: { ...token?.token?.topBid },
      },
    }
  }

  const { data: signer } = useSigner()
  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  const hotpotPrice = ethers.utils.formatEther(
    (hotpotListing &&
      hotpotListing.total_price &&
      hotpotListing?.total_price.toString()) ||
      '0'
  )

  const hotpotUsdPrice =
    hotpotUsdConversion && hotpotPrice
      ? hotpotUsdConversion * parseFloat(hotpotPrice)
      : null

  const {
    contract,
    expiration,
    id,
    image,

    tokenHref,
    tokenId,
    price,
  } = processListing(hotpotListing)

  return (
    <tr
      ref={ref}
      className="group h-[80px] border-b-[1px] border-solid border-b-neutral-300 bg-white dark:border-b-neutral-600 dark:bg-black"
    >
      {/* ITEM */}
      <td className="px-6 py-4 whitespace-nowrap dark:text-white">
        <Link href={tokenHref} legacyBehavior={true}>
          <a className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              {token?.token?.image && (
                <div className="relative overflow-hidden rounded aspect-w-1 aspect-h-1">
                  <img
                    src={optimizeImage(token?.token?.image, 64)}
                    alt="Listing Image"
                    className="w-[48px] object-contain"
                  />
                </div>
              )}
            </div>
            <span className="whitespace-nowrap">
              <div className="reservoir-h6 max-w-[250px] overflow-hidden truncate text-ellipsis font-headings text-base dark:text-white">
                {token?.token?.name}
              </div>
              <div className="text-xs truncate text-neutral-600 dark:text-neutral-300">
                {/* {collectionName} */}
                {token?.token?.collection?.name}
              </div>
            </span>
          </a>
        </Link>
      </td>

      {/* PRICE */}
      <td className="px-6 py-4 whitespace-nowrap dark:text-white">
        {/* <FormatCrypto
          amount={price?.amount?.decimal}
          address={price?.currency?.contract}
          decimals={price?.currency?.decimals}
          maximumFractionDigits={8}
        /> */}{' '}
        {hotpotPrice && (
          <>
            <div className="flex flex-row items-center gap-1 font-semibold justify-left">
              <img src="/eth.png" alt="price" className="w-3 h-3" />
              {hotpotPrice}
            </div>

            <div className="text-xs text-neutral-600 dark:text-neutral-300">
              {formatDollar(hotpotUsdPrice)}
            </div>
          </>
        )}
      </td>

      {/* EXPIRATION */}
      <td className="px-6 py-4 font-light text-neutral-600 dark:text-neutral-300">
        {expiration}
      </td>

      {/* MARKETPLACE */}
      <td className="px-6 py-4 whitespace-nowrap">
        <a
          href={'/'}
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 font-light text-primary-700 dark:text-primary-300"
        >
          <img className="w-6 h-6" alt="Source Icon" src="/hotpot.png" />

          <span className="max-w-[200px] overflow-hidden text-ellipsis">
            Hotpot
          </span>
        </a>
      </td>

      <td className="sticky top-0 right-0 whitespace-nowrap dark:text-white">
        <div className="flex items-center">
          {isOwner && (
            <CancelListingModal
              trigger={
                <button
                  className="btn-primary-outline min-w-[120px] bg-white py-[3px] text-sm text-[#FF3B3B] dark:border-neutral-600 dark:bg-black dark:text-[#FF9A9A] dark:ring-primary-900 dark:focus:ring-4"
                  disabled={false}
                >
                  {' '}
                  Cancel Listing
                </button>
              }
              price={hotpotPrice}
              url={url}
              tokenDetails={token?.token}
              // mutateToken={details.mutate}
              hotpotListing={hotpotListing}
            />
          )}
        </div>
      </td>
    </tr>
  )
}

//Mobile
type UserListingsRowMobileProps = {
  hotpotListing: HotpotListing
  tokens: any[]
  url: string
  isOwner: boolean
  owner: any
  // modal: Props['modal']
  // mutate: ReturnType<typeof useHotpotListings>['mutate']
  ref: null | ((node?: Element | null) => void)
}

const UserListingsMobileTableRow = ({
  hotpotListing,
  ref,
  isOwner,
  tokens,
  owner,
  url,
}: UserListingsRowProps) => {
  const Contract = hotpotListing?.offer_token.toLowerCase()
  const TokenId = hotpotListing?.offer_token_id.toString()
  // Find the token that matches the contract
  const token = tokens?.find(
    (token: tokenType) =>
      token?.token?.contract === Contract && token?.token?.tokenId === TokenId
  )

  let tokenData = null
  if (token) {
    tokenData = {
      token: {
        contract: token?.token?.contract || '',
        tokenId: token?.token?.tokenId || '',
        owner,
        ...token?.token,
      },
      market: {
        floorAsk: { ...token?.ownership?.floorAsk },
        topBid: { ...token?.token?.topBid },
      },
    }
  }

  const { data: signer } = useSigner()
  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  const hotpotPrice = ethers.utils.formatEther(
    (hotpotListing &&
      hotpotListing.total_price &&
      hotpotListing?.total_price.toString()) ||
      '0'
  )

  const hotpotUsdPrice =
    hotpotUsdConversion && hotpotPrice
      ? hotpotUsdConversion * parseFloat(hotpotPrice)
      : null

  const {
    contract,
    expiration,
    id,
    image,

    tokenHref,
    tokenId,
    price,
  } = processListing(hotpotListing)

  return (
    <div
      className="border-b-[1px] border-solid border-b-neutral-300	py-[16px]"
      ref={ref}
    >
      <div className="flex items-center justify-between">
        <Link href={tokenHref || '#'} legacyBehavior={true}>
          <a className="flex items-center gap-2">
            <div className="relative h-14 w-14">
              {token?.token?.image && (
                <div className="relative overflow-hidden rounded aspect-w-1 aspect-h-1">
                  <img
                    src={optimizeImage(token?.token?.image, 56)}
                    alt="Listing Image"
                    className="w-[56px] object-contain"
                    width="56"
                    height="56"
                  />
                </div>
              )}
            </div>
            <div>
              <div className="reservoir-h6 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-headings text-sm dark:text-white">
                {token?.token?.name}
              </div>
              <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-neutral-600 dark:text-neutral-300">
                {token?.token?.collection?.name}
              </div>
            </div>
          </a>
        </Link>
        <div className="flex flex-col">
          {/* <FormatCrypto
                amount={price?.amount?.decimal}
                address={price?.currency?.contract}
                decimals={price?.currency?.decimals}
                maximumFractionDigits={8}
              /> */}
          {hotpotPrice && (
            <>
              <div className="flex flex-row items-center gap-1 text-sm font-semibold justify-left">
                <img src="/eth.png" alt="price" className="w-3 h-3" />
                {hotpotPrice}
              </div>
              <span className="mt-1 text-xs text-right text-neutral-600 dark:text-neutral-300">
                {formatDollar(hotpotUsdPrice)}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div>
          <a
            href={'/'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 mb-1 font-light text-primary-700 dark:text-primary-300"
          >
            <img className="w-6 h-6" alt="Hotpot" src="/hotpot.png" />
            <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-xs">
              Hotpot
            </span>
          </a>
          <div className="text-xs font-light text-neutral-600 dark:text-neutral-300">{`Expires ${expiration}`}</div>
        </div>
        {isOwner && (
          <CancelListingModal
            trigger={
              <button className="btn-primary-outline min-w-[120px] bg-white py-[3px] text-sm text-[#FF3B3B] dark:border-neutral-600 dark:bg-black dark:text-[#FF9A9A] dark:ring-primary-900 dark:focus:ring-4">
                Cancel
              </button>
            }
            price={hotpotPrice}
            url={url}
            tokenDetails={token?.token}
            hotpotListing={hotpotListing}
          />
        )}
      </div>
    </div>
  )
}

// const UserListingsMobileRow = ({
//   isOwner,
//   listing,
//   modal,
//   mutate,
//   ref,
// }: UserListingsRowProps) => {
//   const { data: signer } = useSigner()
//   const usdConversion = useCoinConversion(
//     listing?.price?.currency?.symbol ? 'usd' : undefined,
//     listing?.price?.currency?.symbol
//   )

//   const usdPrice =
//     usdConversion && listing?.price?.amount?.decimal
//       ? usdConversion * listing?.price?.amount?.decimal
//       : null

//   const {
//     collectionName,
//     contract,
//     expiration,
//     id,
//     image,
//     name,
//     tokenHref,
//     tokenId,
//     price,
//     source,
//   } = processListing(listing)

//   return (
//     <div
//       className="border-b-[1px] border-solid border-b-neutral-300	py-[16px]"
//       ref={ref}
//     >
//       <div className="flex items-center justify-between">
//         <Link href={tokenHref || '#'} legacyBehavior={true}>
//           <a className="flex items-center gap-2">
//             <div className="relative h-14 w-14">
//               {image && (
//                 <div className="relative overflow-hidden rounded aspect-w-1 aspect-h-1">
//                   <img
//                     src={optimizeImage(image, 56)}
//                     alt="Bid Image"
//                     className="w-[56px] object-contain"
//                     width="56"
//                     height="56"
//                   />
//                 </div>
//               )}
//             </div>
//             <div>
//               <div className="reservoir-h6 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-headings text-sm dark:text-white">
//                 {name}
//               </div>
//               <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-neutral-600 dark:text-neutral-300">
//                 {collectionName}
//               </div>
//             </div>
//           </a>
//         </Link>
//         <div className="flex flex-col">
//           <FormatCrypto
//             amount={price?.amount?.decimal}
//             address={price?.currency?.contract}
//             decimals={price?.currency?.decimals}
//             maximumFractionDigits={8}
//           />
//           {usdPrice && (
//             <span className="mt-1 text-xs text-right text-neutral-600 dark:text-neutral-300">
//               {formatDollar(usdPrice)}
//             </span>
//           )}
//         </div>
//       </div>
//       <div className="flex items-center justify-between pt-4">
//         <div>
//           <a
//             href={source.link || '#'}
//             target="_blank"
//             rel="noreferrer"
//             className="flex items-center gap-1 mb-1 font-light text-primary-700 dark:text-primary-300"
//           >
//             {source.icon && (
//               <img className="w-6 h-6" alt="Source Icon" src={source.icon} />
//             )}
//             <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-xs">
//               {source.name}
//             </span>
//           </a>
//           <div className="text-xs font-light text-neutral-600 dark:text-neutral-300">{`Expires ${expiration}`}</div>
//         </div>
//         <CancelListing
//           data={{
//             id,
//             contract,
//             tokenId,
//           }}
//           signer={signer}
//           show={isOwner}
//           isInTheWrongNetwork={modal.isInTheWrongNetwork}
//           setToast={modal.setToast}
//           mutate={mutate}
//           trigger={
//             <Dialog.Trigger className="btn-primary-outline min-w-[120px] bg-white py-[3px] text-sm text-[#FF3B3B] dark:border-neutral-600 dark:bg-black dark:text-[#FF9A9A] dark:ring-primary-900 dark:focus:ring-4">
//               Cancel
//             </Dialog.Trigger>
//           }
//         />
//       </div>
//     </div>
//   )
// }

export default UserListingsTable

function processListing(hotpotListing: HotpotListing) {
  const tokenId = hotpotListing?.offer_token_id.toString()
  const contract = hotpotListing?.offer_token
  const collectionRedirectUrl = `${API_BASE}/redirect/collections/${hotpotListing?.offer_token}/image/v1`

  const data = {
    contract,
    tokenId,
    image: collectionRedirectUrl,
    // name: listing?.criteria?.data?.token?.name,
    expiration:
      hotpotListing?.end_time === 0
        ? 'Never'
        : DateTime.fromMillis(+`${hotpotListing?.end_time}000`).toRelative(),
    id: hotpotListing?.offer_token_id,
    // collectionName: listing?.criteria?.data?.collection?.name,

    price: ethers.utils.parseEther(hotpotListing?.offer_amount.toString()),
  }

  const tokenHref = `/${data.contract}/${data.tokenId}`

  return { ...data, tokenHref }
}
