import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import Image from 'next/legacy/image'
import { Address, useSigner } from 'wagmi'
import { useAccount, useNetwork } from 'wagmi'
import { optimizeImage } from 'lib/optmizeImage'
import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { ListModal } from '@reservoir0x/reservoir-kit-ui'
import { useMediaQuery } from '@react-hookz/web'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { getCartCurrency, getTokensMap } from 'recoil/cart'
import { HotpotListing } from 'types/hotpot'
import { formatBN } from 'lib/numbers'
import useCoinConversion from 'hooks/useCoinConversion'
import useRecentHotpotData from 'hooks/useRecentHotpotData'
import getCartTotalPriceHotpot from 'recoil/cart/getCartTotalPriceHotpot'
import CancelListingModal from './modal/CancelListingModal'
import useHotpotListings from 'hooks/useHotpotListings'
import recoilCartTokens from 'recoil/cart'
import BuyModal from './modal/BuyModal'
import SwapCartModal from './SwapCartModal'
import setParams from 'lib/params'
import useTix from '../lib/tix'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const CURRENCIES = process.env.NEXT_PUBLIC_LISTING_CURRENCIES
const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE
const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const HOTPOT_API = process.env.NEXT_PUBLIC_HOTPOT_API

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']
let listingCurrencies: ListingCurrencies = undefined

if (CURRENCIES) {
  listingCurrencies = JSON.parse(CURRENCIES)
}

export type RecentListing = {
  total_price: number
  order_hash: String
  offerer: Address
  offer_token: Address
  offer_token_id: number
  offer_amount: number
  end_time: number
  royalty_percent: number
  royalty_recipient: Address
  salt: number
}

type TokenCardRecentProps = {
  hotpotListing: RecentListing
}

const TokenCardRecent: React.FC<TokenCardRecentProps> = ({ hotpotListing }) => {
  const account = useAccount()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const [tokenDetails, setTokenDetails] = useState(null)
  const tokensMap = useRecoilValue(getTokensMap)
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const [clearCartOpen, setClearCartOpen] = useState(false)
  const [cartToSwap, setCartToSwap] = useState<undefined | typeof cartTokens>()
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')
  const contract =
    (hotpotListing && hotpotListing?.offer_token.toLowerCase()) || ''
  const tokenId =
    (hotpotListing && hotpotListing?.offer_token_id.toString()) || ''
  if (!hotpotListing) return null
  const cartTokenId = `${hotpotListing?.offer_token}:${hotpotListing?.offer_token_id}`
  //Buy Cancel Listing
  const recentListingUrl = `${HOTPOT_API}/order/collection/${hotpotListing?.offer_token}/token/${hotpotListing?.offer_token_id}?chain=mainnet`
  const recentHotpotListing = useHotpotListings(recentListingUrl)
  const cartTotalHotpot = useRecoilValueLoadable(getCartTotalPriceHotpot)
  const { mutate: mutateRecentListing } = useRecentHotpotData()

  if (!CHAIN_ID) return null
  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)

  const isOwner =
    hotpotListing.offerer?.toLowerCase() === account?.address?.toLowerCase()
  const imageSize = singleColumnBreakpoint ? 533 : 250

  async function fetchData(contract: string, tokenId: string) {
    const options: RequestInit | undefined = {}

    if (RESERVOIR_API_KEY) {
      options.headers = {
        'x-api-key': RESERVOIR_API_KEY,
      }
    }

    const url = new URL('/tokens/v5', RESERVOIR_API_BASE)
    const query = {
      tokens: [`${contract}:${tokenId}`],
      includeTopBid: true,
      includeAttributes: true,
      includeDynamicPricing: true,
      normalizeRoyalties: true,
    }

    const href = setParams(url, query)

    try {
      const res = await fetch(href, options)
      const data = await res.json()
      setTokenDetails(data?.tokens?.[0]?.token)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const tokenData = useTokens({
    tokens: [`${contract}:${tokenId}`],
    includeTopBid: true,
    includeAttributes: true,
    includeDynamicPricing: true,
  })

  const tokens = tokenData.data
  const token = tokens?.[0] || { token: tokenDetails }
  if (!token) {
    return null
  }

  useEffect(() => {
    if (hotpotListing) {
      fetchData(contract, tokenId)
    }
  }, [contract, tokenId, hotpotListing])

  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  const hotpotPrice = ethers.utils.formatEther(
    hotpotListing?.total_price?.toString() || '0'
  )
  const formattedPrice = formatBN(parseFloat(hotpotPrice), 4, 18)
  const hotpotUsdPrice =
    hotpotUsdConversion && hotpotPrice
      ? hotpotUsdConversion * parseFloat(hotpotPrice)
      : null

  const tix = useTix(hotpotPrice ?? '0')

  //For buy and sell
  const isInCart = Boolean(tokensMap[cartTokenId])
  let canAddToCart = true
  const isListed = true
  return (
    <>
      <SwapCartModal
        open={clearCartOpen}
        setOpen={setClearCartOpen}
        cart={cartToSwap}
      />
      <div
        key={`$${hotpotListing?.offer_token}${hotpotListing?.offer_token_id}`}
        className="group relative mb-6 grid transform-gpu self-start overflow-hidden rounded-[8px] border border-[#D4D4D4] bg-white transition ease-in hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:ease-out dark:border-0 dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600"
      >
        {/* {isInCart ? (
          <div className="absolute top-4 right-4 z-10 flex h-[34px] w-[34px] animate-slide-down items-center justify-center overflow-hidden rounded-full bg-primary-700">
            <FaShoppingCart className="h-[18px] w-[18px] text-white" />
          </div>
        ) : null} */}

        <Link
          key={`${hotpotListing?.offer_token}${hotpotListing?.offer_token_id}`}
          href={`/${hotpotListing?.offer_token}/${hotpotListing?.offer_token_id}`}
          legacyBehavior={true}
        >
          <a className="m-2 ">
            {token?.token?.image || token?.token?.collection?.image ? (
              <div className="relative rounded max-w-15">
                {tix > 0 && <Ticket text={`+${tix} TIX`} />}

                <Image
                  loader={({ src, width }) => {
                    return `${src}?w=${width}`
                  }}
                  src={optimizeImage(
                    token?.token?.image || token?.token?.collection?.image,
                    imageSize
                  )}
                  alt={`${token?.token?.name}`}
                  className="w-full rounded"
                  width={imageSize}
                  height={imageSize}
                  objectFit="cover"
                  layout="responsive"
                />
              </div>
            ) : (
              <div className="relative max-w-15">
                {tix > 0 && <Ticket text={`+${tix} TIX`} />}

                <Image
                  loader={({ src, width }) => {
                    return `${src}?w=${width}`
                  }}
                  src={'/nft_placeholder.png'}
                  alt={`${hotpotListing?.offer_token_id}`}
                  className="w-full"
                  width={imageSize}
                  height={imageSize}
                  objectFit="cover"
                  layout="responsive"
                />
              </div>
            )}
          </a>
        </Link>
        <div
          className={`  w-full bg-white  transition-all dark:bg-neutral-900  ${
            isOwner ? '' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className="px-4 pt-2 overflow-hidden text-sm truncate reservoir-subtitle dark:text-white lg:pt-2"
              title={token?.token?.name || `#${hotpotListing.offer_token_id}`}
            >
              {token?.token?.name || `#${hotpotListing.offer_token_id}`}
            </div>
            {/* {collectionSize &&
            collectionAttributes &&
            collectionAttributes?.length >= 2 &&
            collectionSize >= 2 &&
            token.token?.rarityRank &&
            token.token?.kind != 'erc1155' && (
              <RarityTooltip
                rarityRank={token.token?.rarityRank}
                collectionSize={collectionSize}
              />
            )} */}
          </div>
          <div className="flex items-center justify-between">
            <Link
              key={`${token?.token?.contract}:${token?.token?.tokenId}`}
              href={`/collections/${token?.token?.contract}`}
              legacyBehavior={true}
            >
              <a href={`/collections/${token?.token?.contract}`}>
                <div
                  className={`reservoir-subtitle mb-1 max-w-[200px] cursor-pointer overflow-hidden truncate px-4 pt-1 text-xs text-gray-500 transition-transform duration-200 hover:translate-x-1 hover:transform dark:text-gray-200 lg:pt-1`}
                  title={token?.token?.collection?.name}
                >
                  {token?.token?.collection?.name}
                </div>
              </a>
            </Link>
          </div>

          <div className="flex items-center justify-between px-4 pb-4 lg:pb-3">
            {isListed && formattedPrice ? (
              <>
                <div className="flex flex-row items-center gap-1 reservoir-h6">
                  <img src="/eth.png" alt="currency" className="w-4 h-4" />
                  {formattedPrice.toString()}
                </div>
                <div className="text-right">
                  <img className="w-6 h-6" src="/hotpot.png" alt="" />
                </div>
              </>
            ) : (
              <>
                <div></div>
              </>
            )}
          </div>

          {isOwner && tokenDetails && (
            <div className="grid">
              <CancelListingModal
                trigger={
                  <button className="group reservoir-h1  mx-2 mb-2 inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-red-500 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed group-hover:from-red-500 group-hover:to-red-500 group-hover:text-white dark:text-neutral-100 dark:focus:ring-blue-800">
                    <span className="relative w-full rounded-[7px] bg-white px-6 py-2 group-hover:bg-red-500  dark:bg-neutral-900">
                      Cancel Listing
                    </span>
                  </button>
                }
                price={hotpotPrice}
                url={recentListingUrl}
                tokenDetails={tokenDetails}
                mutateToken={mutateRecentListing}
                hotpotListing={recentHotpotListing.data}
              />
            </div>
          )}

          {!isOwner && tokenDetails && (
            <div
              className={`grid ${
                isInCart || canAddToCart ? 'grid-cols-1' : ''
              }`}
            >
              <BuyModal
                trigger={
                  <button className="group reservoir-h1  mx-2 mb-2 inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-[#101828] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed group-hover:from-[#620DED] group-hover:to-[#620DED] group-hover:text-white dark:text-neutral-100 dark:focus:ring-blue-800">
                    <span className="relative w-full rounded-[7px] bg-white px-6 py-2 group-hover:bg-[#620DED]  dark:bg-neutral-900">
                      Buy Now
                    </span>
                  </button>
                }
                price={hotpotPrice}
                url={recentListingUrl}
                tokenDetails={tokenDetails}
                mutateToken={mutateRecentListing}
                hotpotListing={recentHotpotListing.data}
              />
              {/* {isInCart && (
                <button
                  onClick={() => {
                    const newCartTokens = [...cartTokens]
                    const index = newCartTokens.findIndex(
                      (newCartToken) =>
                        newCartToken.token.contract ===
                          token?.token?.contract &&
                        newCartToken.token.tokenId === token?.token?.tokenId
                    )
                    newCartTokens.splice(index, 1)
                    setCartTokens(newCartTokens)
                  }}
                  className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 text-[#FF3B3B] disabled:cursor-not-allowed dark:border-neutral-600 dark:text-red-300"
                >
                  Remove
                </button>
              )} */}
              {/* {!isInCart && canAddToCart && (
                <button
                  disabled={isInTheWrongNetwork}
                  onClick={() => {
                    if (token && token.token && token.market) {
                      if (cartCurrency) {
                        setCartToSwap &&
                          setCartToSwap([
                            {
                              token: token.token,
                              market: token.market,
                              hotpotListing:
                                recentHotpotListing.data as HotpotListing,
                              tix: tix ?? 0,
                              url: recentListingUrl,
                            },
                          ])
                        setClearCartOpen && setClearCartOpen(true)
                      } else {
                        setCartTokens([
                          ...cartTokens,
                          {
                            token: token.token,
                            market: token.market,
                            hotpotListing:
                              recentHotpotListing.data as HotpotListing,
                            tix: tix ?? 0,
                            url: recentListingUrl,
                          },
                        ])
                      }
                    }
                  }}
                  className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 disabled:cursor-not-allowed dark:border-neutral-600"
                >
                  Add to Cart
                </button>
              )} */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

interface TicketProps {
  text: string
}
const Ticket: React.FC<TicketProps> = ({ text }) => {
  return (
    <div
      className={`reservoir-h1 absolute top-2 left-2 z-10 flex h-[28px] w-[60px] items-center justify-center truncate whitespace-normal bg-[url('/tix.svg')] bg-no-repeat  px-1 text-center text-xs font-medium text-[#FAF9FE]`}
    >
      {text}
    </div>
  )
}

export default TokenCardRecent
