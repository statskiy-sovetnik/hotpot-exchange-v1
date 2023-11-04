import { TokenDetails } from 'types/reservoir'
import {
  ListModal,
  useReservoirClient,
  useTokens,
} from '@reservoir0x/reservoir-kit-ui'
import React, { ComponentPropsWithoutRef, FC, ReactNode, useState } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import { setToast } from './setToast'
import recoilCartTokens, {
  getCartCurrency,
  getPricingPools,
  getTokensMap,
} from 'recoil/cart'
import { ethers } from 'ethers'
import { Collection } from 'types/reservoir'
import { FaGasPump, FaShoppingCart } from 'react-icons/fa'
import { formatBN, formatDollar } from 'lib/numbers'
import { useRouter } from 'next/router'
import { getPricing } from 'lib/token/pricing'
import { HotpotListing } from 'types/hotpot'
import useTix from 'lib/tix'
import BuyNow from 'components/BuyNow'
import useMounted from 'hooks/useMounted'
import BuyModal from 'components/modal/BuyModal'
import FormatCrypto from 'components/FormatCrypto'
import SwapCartModal from 'components/SwapCartModal'
import useCoinConversion from 'hooks/useCoinConversion'
import ListModalCustom from '../../components/modal/ListModal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CancelListingModal from 'components/modal/CancelListingModal'
import getCartTotalPriceHotpot from 'recoil/cart/getCartTotalPriceHotpot'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const SOURCE_ID = process.env.NEXT_PUBLIC_SOURCE_ID
const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON
const API_BASE =
  process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'
const CURRENCIES = process.env.NEXT_PUBLIC_LISTING_CURRENCIES

type Props = {
  details: ReturnType<typeof useTokens>
  collection?: Collection
  isOwner: boolean
  tokenDetails?: TokenDetails
  hotpotListing?: HotpotListing
  url: string
}

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']
let listingCurrencies: ListingCurrencies = undefined

if (CURRENCIES) {
  listingCurrencies = JSON.parse(CURRENCIES)
}

const PriceData: FC<Props> = ({
  details,
  collection,
  isOwner,
  tokenDetails,
  hotpotListing,
  url,
}) => {
  const router = useRouter()
  const isMounted = useMounted()
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const cartTotalHotpot = useRecoilValueLoadable(getCartTotalPriceHotpot)
  const tokensMap = useRecoilValue(getTokensMap)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const cartPools = useRecoilValue(getPricingPools)
  const accountData = useAccount()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const reservoirClient = useReservoirClient()
  const [clearCartOpen, setClearCartOpen] = useState(false)
  const [cartToSwap, setCartToSwap] = useState<undefined | typeof cartTokens>()
  const account = useAccount()
  const token = details.data ? details.data[0] : undefined
  const tokenId = token?.token?.tokenId
  const contract = token?.token?.contract

  const hotpotPrice = ethers.utils.formatEther(
    hotpotListing?.total_price?.toString() || 0
  )
  const tix = useTix(hotpotPrice ?? '0')

  let floorAskPrice = getPricing(cartPools, token)
  let canAddToCart = true

  // Disabling the rules of hooks here due to erroneous error message,
  //  the linter is likely confused due to two custom hook calls of the same name
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const topBidUsdConversion = useCoinConversion(
    token?.market?.topBid?.price?.currency?.symbol ? 'usd' : undefined,
    token?.market?.topBid?.price?.currency?.symbol
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const floorAskUsdConversion = useCoinConversion(
    floorAskPrice?.currency?.symbol ? 'usd' : undefined,
    floorAskPrice?.currency?.symbol
  )

  const hotpotUsdConversion = useCoinConversion('usd', 'eth')

  if (!isMounted) {
    return null
  }

  const topBidUsdPrice =
    topBidUsdConversion && token?.market?.topBid?.price?.amount?.decimal
      ? topBidUsdConversion * token?.market?.topBid?.price?.amount?.decimal
      : null

  const floorAskUsdPrice =
    floorAskUsdConversion && floorAskPrice?.amount?.decimal
      ? floorAskUsdConversion * floorAskPrice?.amount?.decimal
      : null

  const hotpotUsdPrice =
    hotpotUsdConversion && hotpotPrice
      ? hotpotUsdConversion * parseFloat(hotpotPrice)
      : null

  const listSourceName = token?.market?.floorAsk?.source?.name as
    | string
    | undefined
  const listSourceDomain = token?.market?.floorAsk?.source?.domain as
    | string
    | undefined

  const offerSourceName = token?.market?.topBid?.source?.name as
    | string
    | undefined
  const offerSourceDomain = token?.market?.topBid?.source?.domain as
    | string
    | undefined

  let isLocalListed = false

  if (
    reservoirClient?.source &&
    listSourceDomain &&
    reservoirClient.source === listSourceDomain
  ) {
    isLocalListed = true
  } else if (SOURCE_ID && listSourceName && SOURCE_ID === listSourceName) {
    isLocalListed = true
  }

  const listSourceLogo =
    isLocalListed && SOURCE_ICON
      ? SOURCE_ICON
      : `${API_BASE}/redirect/sources/${
          listSourceDomain || listSourceName
        }/logo/v2`

  if (!CHAIN_ID) return null

  const isTopBidder =
    accountData.isConnected &&
    token?.market?.topBid?.maker?.toLowerCase() ===
      accountData?.address?.toLowerCase()
  const isListed = token
    ? floorAskPrice !== null && token?.token?.kind !== 'erc1155'
    : false
  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)

  const offerSourceLogo = `${API_BASE}/redirect/sources/${
    offerSourceDomain || offerSourceName
  }/logo/v2`

  const listSourceRedirect = `${API_BASE}/redirect/sources/${
    listSourceDomain || listSourceName
  }/tokens/${contract}:${tokenId}/link/v2`

  const isHotpot =
    tokenDetails?.owner !== null &&
    tokenDetails?.owner?.toLowerCase() == hotpotListing?.offerer?.toLowerCase()

  const isLowerPrice =
    (isHotpot &&
      parseFloat(hotpotPrice) <= (floorAskPrice?.amount?.decimal ?? 0)) ||
    (isHotpot && floorAskPrice === null)

  const isInCart = Boolean(tokensMap[`${contract}:${tokenId}`])

  const formattedPrice = formatBN(parseFloat(hotpotPrice), 4, 18)

  return (
    <div className="col-span-full md:col-span-4 lg:col-span-5 lg:col-start-2">
      <article className="p-6 bg-white border border-gray-300 col-span-full rounded-2xl dark:border-neutral-600 dark:bg-black">
        <div className="grid grid-cols-1 gap-6">
          {(isHotpot && isLowerPrice) || (isHotpot && isOwner) ? (
            <div className="flex flex-row">
              <div className="flex-grow">
                <div className="reservoir-h5 font-headings dark:text-white">
                  List Price
                </div>
                <div className="flex flex-row items-center gap-1 my-1 justify-left md:gap-2">
                  <p className="text-sm font-light">
                    on Hotpot{' '}
                    {/* <span className="hidden md:flex md:flex-col">
                      Marketplace{' '}
                    </span> */}
                  </p>
                  <img
                    src="/hotpot.png"
                    alt="hotpot-marketplace"
                    className="w-6 h-6"
                  />
                </div>
              </div>
              <div className="reservoir-h3 font-headings dark:text-white">
                <div className="flex flex-row items-center">
                  {tix > 0 && <Ticket text={`+${tix} TIX`} />}

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-center">
                      <img
                        src="/eth.png"
                        alt="hotpot-marketplace"
                        className="w-6 h-6 mr-1"
                      />{' '}
                      {formattedPrice.toString()}
                    </div>

                    <div className="text-sm text-neutral-600 dark:text-neutral-300">
                      {formatDollar(hotpotUsdPrice)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Price
              title="List Price"
              source={
                listSourceName && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={listSourceRedirect}
                    className="flex items-center gap-2 reservoir-body dark:text-white"
                  >
                    on {listSourceName}
                    <img
                      className="w-6 h-6"
                      src={listSourceLogo}
                      alt="Source Logo"
                    />
                  </a>
                )
              }
              price={
                <FormatCrypto
                  amount={floorAskPrice?.amount?.decimal}
                  address={floorAskPrice?.currency?.contract}
                  decimals={floorAskPrice?.currency?.decimals}
                  logoWidth={30}
                  maximumFractionDigits={8}
                />
              }
              usdPrice={floorAskUsdPrice}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 mt-6 md:grid-cols-2">
          {account.isDisconnected ? (
            <ConnectWalletButton className="w-full">
              <span>Connect Wallet</span>
            </ConnectWalletButton>
          ) : (
            <>
              {isOwner && !isHotpot && (
                <ListModalCustom
                  trigger={
                    <button className="w-full btn-primary-fill dark:ring-primary-900 dark:focus:ring-4">
                      {hotpotListing?.offer_amount
                        ? 'Create New Listing'
                        : 'List for Sale'}
                    </button>
                  }
                  collectionId={contract}
                  tokenId={tokenId}
                  tokenDetails={token?.token}
                  mutate={details.mutate}
                  url={url}
                  onListingError={(err: any) => {
                    if (err?.code === 4001) {
                      setToast({
                        kind: 'error',
                        message: 'You have canceled the transaction.',
                        title: 'User canceled transaction',
                      })
                      return
                    }
                    setToast({
                      kind: 'error',
                      message: 'The transaction was not completed.',
                      title: 'Could not list token',
                    })
                  }}
                />
              )}
              {isOwner && isHotpot && (
                <CancelListingModal
                  trigger={
                    <button
                      className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                      disabled={false}
                    >
                      {' '}
                      <FaGasPump className="ml-[10px] h-[16px] w-[16px] text-gray-700 dark:text-primary-100" />
                      Cancel Listing
                    </button>
                  }
                  price={hotpotPrice}
                  url={url}
                  tokenDetails={tokenDetails}
                  mutateToken={details.mutate}
                  hotpotListing={hotpotListing}
                />
              )}

              {!isOwner && !isLowerPrice && (
                <BuyNow
                  buttonClassName="btn-primary-fill col-span-1"
                  data={{
                    details: details,
                  }}
                  signer={signer}
                  isInTheWrongNetwork={isInTheWrongNetwork}
                  mutate={details.mutate}
                />
              )}
              {isHotpot && !isOwner && isLowerPrice && (
                <BuyModal
                  trigger={
                    <button
                      className="col-span-1 btn-primary-fill"
                      disabled={false}
                    >
                      Buy Now
                    </button>
                  }
                  price={hotpotPrice}
                  tokenDetails={tokenDetails}
                  url={url}
                  mutateToken={details.mutate}
                  hotpotListing={hotpotListing}
                />
              )}

              {isInCart && !isOwner && (
                <button
                  onClick={() => {
                    const newCartTokens = [...cartTokens]
                    const index = newCartTokens.findIndex(
                      (cartToken) =>
                        cartToken?.token?.contract === contract &&
                        cartToken?.token?.tokenId === tokenId
                    )
                    newCartTokens.splice(index, 1)
                    setCartTokens(newCartTokens)
                  }}
                  className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                >
                  Remove
                  <FaShoppingCart className="ml-[10px] h-[18px] w-[18px] text-[#FF3B3B] dark:text-[#FF9A9A]" />
                </button>
              )}

              {!isInCart &&
                !isOwner &&
                canAddToCart &&
                (isListed || (isHotpot && isLowerPrice)) && (
                  <button
                    disabled={isInTheWrongNetwork}
                    onClick={() => {
                      if (token?.token && token.market) {
                        if (
                          !cartCurrency ||
                          floorAskPrice?.currency?.contract ===
                            cartCurrency?.contract ||
                          !cartTotalHotpot.contents
                        ) {
                          setCartTokens([
                            ...cartTokens,
                            {
                              token: token.token,
                              market: token.market,
                              hotpotListing: hotpotListing as HotpotListing,
                              tix: tix ?? 0,
                              url: url,
                            },
                          ])
                        } else {
                          setCartToSwap([
                            {
                              token: token.token,
                              market: token.market,
                              hotpotListing: hotpotListing as HotpotListing,
                              tix: tix ?? 0,
                              url: url,
                            },
                          ])
                          setClearCartOpen(true)
                        }
                      }
                    }}
                    className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                  >
                    Add to Cart
                    <FaShoppingCart className="ml-[10px] h-[18px] w-[18px] text-primary-700 dark:text-primary-100" />
                  </button>
                )}

              {/* {isHotpot && canAddToCart && (
                <button
                  disabled={!floorAskPrice || !currentNFT}
                  onClick={() => {
                    if (token?.token && token.market) {
                      if (
                        !cartCurrency ||
                        floorAskPrice?.currency?.contract ===
                          cartCurrency?.contract
                      ) {
                        setCartTokens([
                          ...cartTokens,
                          {
                            token: token.token,
                            market: token.market,
                            itemId: currentNFT?.itemId ?? 0,
                            hotpotPrice: currentNFT?.price ?? '0',
                            tix: tix ?? 0,
                          },
                        ])
                      } else {
                        setCartToSwap([
                          {
                            token: token.token,
                            market: token.market,
                            itemId: currentNFT?.itemId ?? 0,
                            hotpotPrice: currentNFT?.price ?? '0',
                            tix: tix ?? 0,
                          },
                        ])
                        setClearCartOpen(true)
                      }
                    }
                  }}
                  className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                >
                  Add to Cart
                  <FaShoppingCart className="ml-[10px] h-[18px] w-[18px] text-primary-700 dark:text-primary-100" />
                </button>
              )} */}
            </>
          )}
        </div>
      </article>

      <SwapCartModal
        open={clearCartOpen}
        setOpen={setClearCartOpen}
        cart={cartToSwap}
      />
    </div>
  )
}

export default PriceData

interface TicketProps {
  text: string
}
const Ticket: React.FC<TicketProps> = ({ text }) => {
  return (
    <div
      className={`z-5 reservoir-h1 mx-2 mb-5 flex h-[28px] w-[60px] items-center justify-center truncate truncate whitespace-normal bg-[url('/tix.svg')] bg-no-repeat  px-1 text-center text-xs font-medium text-[#FAF9FE]`}
    >
      {text}
    </div>
  )
}

const Price: FC<{
  title: string
  price: ReactNode
  source?: ReactNode
  usdPrice: number | null
}> = ({ title, price, usdPrice, source }) => (
  <div className="flex flex-row">
    <div className="flex-grow">
      <div className="reservoir-h5 font-headings dark:text-white">{title}</div>
      {source}
    </div>
    <div className="reservoir-h3 font-headings dark:text-white">
      {price}
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        {formatDollar(usdPrice)}
      </div>
    </div>
  </div>
)
