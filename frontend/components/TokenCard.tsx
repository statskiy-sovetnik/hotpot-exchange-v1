import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import Image from 'next/legacy/image'
import { FaShoppingCart } from 'react-icons/fa'
import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import FormatCrypto from 'components/FormatCrypto'
import { ethers } from 'ethers'
import { getCartCurrency, getTokensMap } from 'recoil/cart'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import recoilCartTokens, { getPricingPools } from 'recoil/cart'
import { ListModal, useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { setToast } from './token/setToast'
import { MutatorCallback } from 'swr'
import { HotpotListing } from 'types/hotpot'
import { Collection } from 'types/reservoir'
import { getPricing } from 'lib/token/pricing'
import { useMediaQuery } from '@react-hookz/web'
import { useRouter } from 'next/router'
import { formatBN } from 'lib/numbers'
import getCartTotalPriceHotpot from 'recoil/cart/getCartTotalPriceHotpot'
import CancelListingModal from './modal/CancelListingModal'
import ListModalCustom from './modal/ListModal'
import RarityTooltip from './RarityTooltip'
import BuyModal from './modal/BuyModal'
import useTokens from 'hooks/useTokens'
import BuyNow from 'components/BuyNow'
import useTix from '../lib/tix'

const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const API_BASE =
  process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'
const CURRENCIES = process.env.NEXT_PUBLIC_LISTING_CURRENCIES

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies']
let listingCurrencies: ListingCurrencies = undefined

if (CURRENCIES) {
  listingCurrencies = JSON.parse(CURRENCIES)
}

type Props = {
  token?: ReturnType<typeof useTokens>['tokens']['data'][0]
  collectionImage: string | undefined
  collectionSize?: number | undefined
  collectionAttributes?: Collection['attributes']
  mutate: MutatorCallback
  setClearCartOpen?: Dispatch<SetStateAction<boolean>>
  setCartToSwap?: Dispatch<SetStateAction<any | undefined>>
  hotpotListing: HotpotListing[] | undefined
  url: string
}

const TokenCard: FC<Props> = ({
  token,
  collectionImage,
  collectionSize,
  collectionAttributes,
  mutate,
  setClearCartOpen,
  setCartToSwap,
  hotpotListing,
  url,
}) => {
  const account = useAccount()
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const tokensMap = useRecoilValue(getTokensMap)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const cartTotalHotpot = useRecoilValueLoadable(getCartTotalPriceHotpot)
  const cartPools = useRecoilValue(getPricingPools)
  const [currentNFT, setCurrentNFT] = useState<HotpotListing | undefined>(
    undefined
  )
  const reservoirClient = useReservoirClient()
  const singleColumnBreakpoint = useMediaQuery('(max-width: 640px)')
  const { pathname } = useRouter()
  const isProfile = /^\/address\//.test(pathname)
  if (!token) return null

  if (!CHAIN_ID) return null
  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)
  const tokenId = `${token?.token?.contract}:${token?.token?.tokenId}`

  const isInCart = Boolean(tokensMap[tokenId])
  const isOwner =
    token?.token?.owner !== null &&
    token?.token?.owner?.toLowerCase() === account?.address?.toLowerCase()

  const imageSize = singleColumnBreakpoint ? 533 : 250

  let price = getPricing(cartPools, token)
  let canAddToCart = true

  if (!price && token.market?.floorAsk?.dynamicPricing?.data?.pool) {
    canAddToCart = false
  }

  const id = token?.token?.tokenId
  const contract = token?.token?.contract

  const findItem = (
    contractToFind: string,
    tokenIdToFind: string
  ): HotpotListing | undefined => {
    if (!hotpotListing) {
      return undefined
    }

    for (const item of hotpotListing) {
      const {
        total_price,
        order_hash,
        offerer,
        offer_token,
        offer_token_id,
        offer_amount,
        royalty_percent,
        royalty_recipient,
        salt,
        end_time,
        order_signature,
        pending_amount_signature,
      } = item

      if (
        item.offer_token === contractToFind &&
        item.offer_token_id === parseInt(tokenIdToFind)
      ) {
        return {
          total_price,
          order_hash,
          offerer,
          offer_token,
          offer_token_id,
          offer_amount,
          royalty_percent,
          royalty_recipient,
          end_time,
          salt,
          order_signature,
          pending_amount_signature,
        }
      }
    }

    return undefined
  }

  useEffect(() => {
    if (hotpotListing && contract && id) {
      const currentNFT = findItem(contract, id)
      setCurrentNFT(currentNFT)
    }
  }, [hotpotListing, contract, tokenId])

  const isListed =
    token?.token?.owner !== null &&
    token?.token?.owner?.toLowerCase() == currentNFT?.offerer.toLowerCase()
  const hotpotPrice = ethers.utils.formatEther(
    currentNFT?.total_price?.toString() || 0
  )

  const isLowerPrice =
    (isListed && parseFloat(hotpotPrice) <= (price?.amount?.decimal ?? 0)) ||
    (isListed && price === null)
  const formattedPrice = formatBN(parseFloat(hotpotPrice), 4, 18)
  const tix = useTix(hotpotPrice ?? '0')

  return (
    <div
      key={`${token?.token?.contract}${token?.token?.tokenId}`}
      className="group relative mb-6 grid transform-gpu self-start overflow-hidden rounded-[8px] border border-[#D4D4D4] bg-white transition ease-in hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:ease-out dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
    >
      {isInCart ? (
        <div className="absolute top-4 right-4 z-10 flex h-[34px] w-[34px] animate-slide-down items-center justify-center overflow-hidden rounded-full bg-primary-700">
          <FaShoppingCart className="h-[18px] w-[18px] text-white" />
        </div>
      ) : null}

      <Link
        key={`${token?.token?.contract}:${token?.token?.tokenId}`}
        href={`/${token?.token?.contract}/${token?.token?.tokenId}`}
        legacyBehavior={true}
      >
        <a className="m-2 mb-[85px]">
          {token?.token?.image ? (
            <div className="relative rounded max-w-15">
              {isListed && isLowerPrice && tix > 0 && (
                <Ticket text={`+${tix} TIX`} />
              )}

              <Image
                priority
                loader={({ src, width }) => {
                  return `${src}?w=${width}`
                }}
                src={optimizeImage(token?.token?.image, imageSize)}
                alt={`${token?.token?.name}`}
                className="w-full rounded"
                width={imageSize}
                height={imageSize}
                objectFit="cover"
                layout="responsive"
              />
            </div>
          ) : (
            <div className="relative w-full ">
              <div className="absolute inset-0 grid place-items-center backdrop-blur-lg">
                <div>
                  <img
                    src={optimizeImage(collectionImage, imageSize)}
                    alt={`${token?.token?.collection?.name}`}
                    className="w-16 h-16 mx-auto mb-4 overflow-hidden border-2 border-white rounded rounded-full"
                    width="64"
                    height="64"
                  />
                  <div className="text-white reservoir-h6">
                    No Content Available
                  </div>
                </div>
              </div>
              <img
                src={optimizeImage(collectionImage, imageSize)}
                alt={`${token?.token?.collection?.name}`}
                className="object-cover w-full aspect-square"
                width="250"
                height="250"
              />
            </div>
          )}
        </a>
      </Link>
      <div
        className={`absolute bottom-[0px] w-full bg-white transition-all  dark:bg-neutral-900 md:-bottom-[41px] ${
          (!isOwner && !price && !isListed) || (isOwner && !isListed)
            ? ''
            : 'group-hover:bottom-[0px]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`reservoir-subtitle ${
              isProfile ? 'text-sm' : 'mb-3'
            } overflow-hidden truncate px-4 pt-4 dark:text-white lg:pt-3`}
            title={token?.token?.name || token?.token?.tokenId}
          >
            {token?.token?.name || `#${token?.token?.tokenId}`}
          </div>

          {collectionSize &&
            collectionAttributes &&
            collectionAttributes?.length >= 2 &&
            collectionSize >= 2 &&
            token.token?.rarityRank &&
            token.token?.kind != 'erc1155' && (
              <RarityTooltip
                rarityRank={token.token?.rarityRank}
                collectionSize={collectionSize}
              />
            )}
        </div>
        {isProfile && (
          <div className="flex items-center justify-between">
            <Link
              key={`${token?.token?.contract}:${token?.token?.tokenId}`}
              href={`/collections/${token?.token?.contract}`}
              legacyBehavior={true}
            >
              <a href={`/collections/${token?.token?.contract}`}>
                <div
                  className={`reservoir-subtitle mb-1 cursor-pointer overflow-hidden truncate px-4 pt-1 text-xs text-[#A7A7A7] transition-transform duration-200  dark:text-neutral-400 lg:pt-1`}
                  title={token?.token?.collection?.name}
                >
                  {token?.token?.collection?.name}
                </div>
              </a>
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between px-4 pb-4 lg:pb-4">
          {(isListed && isLowerPrice) || (isListed && isOwner) ? (
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
              {price?.amount?.decimal != null &&
              price?.amount?.decimal != undefined ? (
                <>
                  <div className="reservoir-h6">
                    <FormatCrypto
                      amount={price?.amount?.decimal}
                      address={price?.currency?.contract}
                      decimals={price?.currency?.decimals}
                      maximumFractionDigits={4}
                    />
                  </div>
                  <div className="text-right">
                    {token?.market?.floorAsk?.source && (
                      <img
                        className="w-6 h-6"
                        src={
                          reservoirClient?.source &&
                          reservoirClient.source ===
                            token.market.floorAsk.source.domain &&
                          SOURCE_ICON
                            ? SOURCE_ICON
                            : `${API_BASE}/redirect/sources/${token?.market.floorAsk.source.domain}/logo/v2`
                        }
                        alt=""
                      />
                    )}
                  </div>
                </>
              ) : !isOwner ? (
                <div className="h-[64px]"></div>
              ) : (
                <div className="h-7"></div>
              )}
            </>
          )}
        </div>

        {isOwner && !isListed && (
          <div className="grid">
            <ListModalCustom
              trigger={
                <button className="group reservoir-h1  mx-2 mb-2 inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-[#101828] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed group-hover:from-[#620DED] group-hover:to-[#620DED] group-hover:text-white dark:text-neutral-100 dark:focus:ring-blue-800 md:translate-y-[-41px]">
                  <span className="relative w-full rounded-[7px] bg-white px-6 py-2 group-hover:bg-[#620DED]  dark:bg-neutral-900">
                    {currentNFT?.offer_amount
                      ? 'Create New Listing'
                      : 'List for Sale'}
                  </span>
                </button>
              }
              collectionId={token.token?.contract}
              tokenId={token.token?.tokenId}
              tokenDetails={token?.token}
              url={url}
              mutate={mutate}
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
          </div>
        )}
        {isOwner && isListed && (
          <div className="grid">
            <CancelListingModal
              trigger={
                <button className=" group reservoir-h1 mx-2 mb-2  inline-flex items-center justify-center overflow-hidden rounded-[4px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-[#FF3B3B] focus:outline-none  focus:ring-4  focus:ring-blue-300 disabled:cursor-not-allowed dark:text-[#FF3B3B]  dark:focus:ring-blue-800">
                  <span className="relative w-full rounded-[3px] bg-white px-4 py-1  dark:bg-neutral-900">
                    Cancel Listing
                  </span>
                </button>
              }
              price={hotpotPrice}
              url={url}
              tokenDetails={token?.token}
              mutateToken={mutate}
              hotpotListing={currentNFT}
            />
          </div>
        )}

        {isListed && !isOwner && isLowerPrice && (
          <div
            className={`grid ${isInCart || canAddToCart ? 'grid-cols-2' : ''}`}
          >
            <BuyModal
              trigger={
                <button className="btn-primary-fill reservoir-subtitle flex h-[40px] items-center justify-center whitespace-nowrap rounded-none text-white focus:ring-0">
                  Buy Now
                </button>
              }
              price={hotpotPrice}
              url={url}
              tokenDetails={token?.token}
              mutateToken={mutate}
              collectionImage={collectionImage}
              hotpotListing={currentNFT}
            />
            {isInCart && (
              <button
                onClick={() => {
                  const newCartTokens = [...cartTokens]
                  const index = newCartTokens.findIndex(
                    (newCartToken) =>
                      newCartToken.token.contract === token?.token?.contract &&
                      newCartToken.token.tokenId === token?.token?.tokenId
                  )
                  newCartTokens.splice(index, 1)
                  setCartTokens(newCartTokens)
                }}
                className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 text-[#FF3B3B] disabled:cursor-not-allowed dark:border-neutral-600 dark:text-red-300"
              >
                Remove
              </button>
            )}
            {!isInCart && canAddToCart && isListed && (
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
                            hotpotListing: currentNFT as HotpotListing,
                            tix: tix ?? 0,
                          },
                        ])
                      setClearCartOpen && setClearCartOpen(true)
                    } else {
                      setCartTokens([
                        ...cartTokens,
                        {
                          token: token.token,
                          market: token.market,
                          hotpotListing: currentNFT as HotpotListing,
                          tix: tix ?? 0,
                          url: url,
                        },
                      ])
                    }
                  }
                }}
                className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 disabled:cursor-not-allowed dark:border-neutral-600"
              >
                Add to Cart
              </button>
            )}
          </div>
        )}
        {price?.amount?.decimal != null &&
          price?.amount?.decimal != undefined &&
          !isOwner &&
          !isLowerPrice && (
            <div
              className={`grid ${
                isInCart || canAddToCart ? 'grid-cols-2' : ''
              }`}
            >
              <BuyNow
                data={{
                  token,
                }}
                mutate={mutate}
                signer={signer}
                isInTheWrongNetwork={isInTheWrongNetwork}
                buttonClassName="btn-primary-fill reservoir-subtitle flex h-[40px] items-center justify-center whitespace-nowrap rounded-none text-white focus:ring-0"
              />
              {isInCart && (
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
              )}
              {!isInCart && canAddToCart && (
                <button
                  disabled={isInTheWrongNetwork}
                  onClick={() => {
                    if (token && token.token && token.market) {
                      if (cartTotalHotpot.contents > 0) {
                        setCartToSwap &&
                          setCartToSwap([
                            {
                              token: token.token,
                              market: token.market,
                              hotpotListing: currentNFT as HotpotListing,
                              tix: tix ?? 0,
                            },
                          ])
                        setClearCartOpen && setClearCartOpen(true)
                      } else {
                        setCartTokens([
                          ...cartTokens,
                          {
                            token: token.token,
                            market: token.market,
                            hotpotListing: currentNFT as HotpotListing,
                            tix: tix ?? 0,
                            url: url,
                          },
                        ])
                      }
                    }
                  }}
                  className="reservoir-subtitle flex h-[40px] items-center justify-center border-t border-neutral-300 disabled:cursor-not-allowed dark:border-neutral-600"
                >
                  Add to Cart
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  )
}

export default TokenCard

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
