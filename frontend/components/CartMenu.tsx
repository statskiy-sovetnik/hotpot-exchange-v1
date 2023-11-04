import { FC, useState } from 'react'
import { Signer, ethers } from 'ethers'
import { setToast } from './token/setToast'
import * as Popover from '@radix-ui/react-popover'
import { styled, keyframes } from '@stitches/react'
import { Execute } from '@reservoir0x/reservoir-sdk'
import { MARKET_ABI_G, MARKET_CONTRACT_G } from 'contracts'
import { FaShoppingCart } from 'react-icons/fa'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { useAccount, useBalance, useContract, useSigner } from 'wagmi'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import cartTokensAtom, {
  getCartCount,
  getCartCurrency,
  getCartTotalPrice,
  getPricingPools,
} from 'recoil/cart'
import { getPricing } from 'lib/token/pricing'
import { formatBN } from 'lib/numbers'
import { HotpotListing } from 'types/hotpot'
import FormatCrypto from 'components/FormatCrypto'
import ConnectWalletButton from './ConnectWalletButton'
import getCartTotalPriceHotpot from 'recoil/cart/getCartTotalPriceHotpot'
import useHotpotListings from 'hooks/useHotpotListings'
import usePrizePool from 'hooks/usePrizePool'
import useFees from 'hooks/useFees'
import Decimal from 'decimal.js'
import { AiOutlineClose } from 'react-icons/ai'

type UseBalanceToken = NonNullable<Parameters<typeof useBalance>['0']>['token']
const HOTPOT_API = process.env.NEXT_PUBLIC_HOTPOT_API
const slideDown = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const StyledContent = styled(Popover.Content, {
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationFillMode: 'forwards',
  '&[data-side="top"]': { animationName: slideUp },
  '&[data-side="bottom"]': { animationName: slideDown },
})

const CartMenu: FC = () => {
  const account = useAccount()
  const cartCount = useRecoilValue(getCartCount)
  const cartTotal = useRecoilValueLoadable(getCartTotalPrice)
  const cartTotalHotpot = useRecoilValueLoadable(getCartTotalPriceHotpot)
  const cartCurrency = useRecoilValue(getCartCurrency)
  const pricingPools = useRecoilValue(getPricingPools)
  const [cartTokens, setCartTokens] = useRecoilState(cartTokensAtom)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [_open, setOpen] = useState(false)
  const [_steps, setSteps] = useState<Execute['steps']>()
  const [waitingTx, setWaitingTx] = useState<boolean>(false)
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const accountData = useAccount()
  const { data: prizePool } = usePrizePool()
  const { data: tradeFee } = useFees()
  const reservoirClient = useReservoirClient()
  const { data: balance } = useBalance({
    address: address,
    token:
      cartCurrency?.symbol !== 'ETH'
        ? (cartCurrency?.contract as UseBalanceToken)
        : undefined,
  })
  const formattedCartTotal = cartTotal.contents

  const formattedCartTotalHotpot = cartTotalHotpot.contents
  const formattedHotpotTotalPrice = formatBN(
    parseFloat(formattedCartTotalHotpot),
    4,
    18
  )
  const hotpotListing = cartTokens.map((token) => token.hotpotListing)
  const url = cartTokens?.[0]?.url
  const id = cartTokens?.[0]?.hotpotListing?.offer_token
  const { mutate: mutateHotpot } = useHotpotListings(url)
  const handleWaitingTx = (isWaiting: boolean) => {
    setWaitingTx(isWaiting)
  }

  const handleSuccess = () => {
    setToast({
      kind: 'success',
      message: 'Your purchase was successful.',
      title: 'Purchase Successful',
    })
  }

  //Buy hotpot listings
  const NftMarketplace = useContract({
    address: MARKET_CONTRACT_G,
    abi: MARKET_ABI_G,
    signerOrProvider: signer,
  })

  const handleFulfillOrder = async (hotpotListingItem: HotpotListing) => {
    try {
      if (hotpotListingItem) {
        const fulfillOrder = {
          order_hash: hotpotListingItem.order_hash,
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
    setIsSuccess(false)
    setWaitingTx(true)

    try {
      if (!NftMarketplace) {
        return
      }
      if (!hotpotListing) {
        console.log('Wait for hotpot listing to load')
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

      await Promise.all(
        hotpotListing.map(async (hotpotItem) => {
          const res = await handleFulfillOrder(hotpotItem)

          if (res) {
            const orderData = await res.json()

            const params = {
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
                  orderData.seller_pending_amount.pending_amount.toString(),
                buyerPendingAmount:
                  orderData.buyer_pending_amount.pending_amount.toString(),
                orderHash: orderData.order_hash,
              },
              salt: orderData.salt.toString(),
              orderSignature: orderData.order_signature,
              pendingAmountsSignature: orderData.pending_amount_signature,
              tokenType: 0,
            }

            const totalPrice = hotpotItem?.total_price.toString() || '0'

            //Last Trade Calculation
            const tradeAmount = ethers.utils.formatEther(
              hotpotItem?.total_price.toString() || '0'
            )

            const currentPotD = new Decimal(prizePool?.currentPotSize)
            const potLimitD = new Decimal(prizePool?.potLimit)
            const tradeAmountD = new Decimal(tradeAmount)
            const tradeFeeD = new Decimal(tradeFee)

            const isLastTrade = tradeAmountD
              .times(tradeFeeD)
              .dividedBy(10000)
              .plus(currentPotD)
              .gte(potLimitD)

            // const isLastTrade =
            //   (parseInt(tradeAmount) * tradeFee) / 10000 + currentPot >=
            //   potLimit
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

            console.log('Listing Transaction Hash:', buyNFT.hash)

            await buyNFT.wait()
          }
        })
      )

      setIsSuccess(true)

      setToast({
        kind: 'complete',
        message: '',
        title: 'Purchase Complete',
      })
      if (mutateHotpot) {
        mutateHotpot()
      }
      setCartTokens([])
      setOpen(false)
    } catch (error) {
      console.log(error)

      setWaitingTx(false)
      setToast({
        kind: 'error',
        message: 'The transaction was not completed.',
        title: 'Could not buy token',
      })
    }
    setWaitingTx(false)
  }

  //
  const execute = async (signer: Signer) => {
    setWaitingTx(true)

    if (!signer) {
      throw 'Missing a signer'
    }

    if (cartTokens.length === 0) {
      throw 'Missing tokens to purchase'
    }

    if (!reservoirClient) throw 'Client not started'

    try {
      await reservoirClient.actions.buyToken({
        expectedPrice: cartTotal.contents,
        tokens: cartTokens.map((token) => token.token),
        signer,
        onProgress: setSteps,
        options: {
          partial: true,
        },
      })

      setCartTokens([])
      setToast({
        kind: 'complete',
        message: 'Your transaction was successful',
        title: 'Purchase Complete',
      })
    } catch (err: any) {
      if (err?.type === 'price mismatch') {
        setToast({
          kind: 'error',
          message: 'Price was greater than expected.',
          title: 'Could not buy token',
        })
      } else if (err?.message.includes('ETH balance')) {
        setToast({
          kind: 'error',
          message: 'You have insufficient funds to buy this token.',
          title: 'Not enough ETH balance',
        })
      } else if (err?.code === 4001) {
        setOpen(false)
        setSteps(undefined)
        setToast({
          kind: 'error',
          message: 'You have canceled the transaction.',
          title: 'User canceled transaction',
        })
      } else {
        setToast({
          kind: 'error',
          message: 'The transaction was not completed.',
          title: 'Could not buy token',
        })
      }
    }

    setWaitingTx(false)
  }

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="relative z-10 grid items-center justify-center w-8 h-8 rounded-full">
          {cartCount > 0 && (
            <div className="absolute flex items-center justify-center w-5 h-5 text-white rounded-full reservoir-subtitle -top-1 -right-1 bg-primary-700">
              {cartCount}
            </div>
          )}
          <FaShoppingCart className="h-[18px] w-[18px]" />
        </div>
      </Popover.Trigger>
      <StyledContent
        sideOffset={22}
        className="z-[10000000] w-[367px] rounded-2xl bg-white p-6 shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-3 reservoir-h6">My Cart</div>
            <div className="flex items-center justify-center w-5 h-5 text-white rounded-full reservoir-subtitle bg-primary-700">
              {cartCount}
            </div>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setCartTokens([])}
              className="text-sm text-primary-700 dark:text-neutral-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* {isSuccess && (
          <div className="flex flex-col items-center justify-center gap-2 mt-4">
            <HiCheckCircle className=" h-[60px] w-[60px] items-center justify-center text-green-700" />
            <h1 className="text-xl font-semibold">
              NFT Purchase Successful! 🎉
            </h1>
            <div className="text-sm font-light text-gray-500">
              Your NFT has been sent to your wallet
            </div>
          </div>
        )} */}

        <div className="mb-6 grid max-h-[300px] gap-2 overflow-auto">
          {cartTokens.map((tokenData, index) => {
            const { token, hotpotListing, tix } = tokenData
            const { collection, contract, name, image, tokenId } = token
            const price = getPricing(pricingPools, tokenData)
            const hotpotPrice =
              !formattedCartTotal &&
              hotpotListing &&
              ethers.utils.formatEther(
                hotpotListing.total_price.toString() || '0'
              )
            const formattedHotpotPrice = formatBN(
              parseFloat(hotpotPrice || '0'),
              4,
              18
            )

            return (
              <div
                key={`${contract}:${tokenId}`}
                className="flex justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700"
              >
                <div className="flex items-center gap-2 overflow-hidden truncate">
                  <div className="h-14 w-14 overflow-hidden rounded-[4px]">
                    <img src={image || collection?.image} alt="" />
                  </div>
                  <div>
                    <div className="reservoir-h6 w-[200px] truncate p-2 text-sm font-medium ">
                      {collection?.name} {`#${tokenId}`}
                    </div>
                    {/* <div className="reservoir-label-s w-[200px] overflow-hidden truncate px-2">
                      {collection?.name}
                    </div> */}
                    {!formattedCartTotal ? (
                      <div className="flex flex-row items-center justify-between gap-1 reservoir-h6">
                        <div className="reservoir-h6 flex flex-row items-center gap-2 px-2 text-sm font-medium text-[#9270FF]">
                          {/* {' '}
                          <img
                            src="/eth-dark.svg"
                            alt="eth"
                            className="w-3 h-3"
                          />{' '} */}
                          {formattedHotpotPrice.toString()} ETH
                        </div>
                        <Ticket text={`+${tix}`} />
                        {/* <div className="ml-6 rounded border border-[#0FA46E] bg-[#DBF1E4] px-2 text-sm text-[#0FA46E] dark:bg-black">
                          +{tix} TIX
                        </div> */}
                      </div>
                    ) : (
                      <div className="reservoir-h6">
                        <FormatCrypto
                          amount={price?.amount?.decimal}
                          address={price?.currency?.contract}
                          decimals={price?.currency?.decimals}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newCartTokens = [...cartTokens]
                    newCartTokens.splice(index, 1)
                    setCartTokens(newCartTokens)
                  }}
                >
                  <AiOutlineClose className="h-4 w-4 text-[#909090]" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between mb-4">
          <div className="font-medium reservoir-h6">You Pay</div>
          {!formattedCartTotal ? (
            <div className="flex flex-row items-center justify-center gap-1 font-medium reservoir-h6">
              <img src="/eth.png" alt="eth" className="w-5 h-5" />
              <span>{formattedHotpotTotalPrice.toString()} ETH</span>
            </div>
          ) : (
            <div className="font-medium reservoir-h6">
              <FormatCrypto
                amount={formattedCartTotal}
                address={cartCurrency?.contract}
                decimals={cartCurrency?.decimals}
                logoWidth={20}
              />{' '}
              ETH
            </div>
          )}
        </div>

        {accountData?.isConnected ? (
          <>
            {' '}
            {!formattedCartTotal &&
              balance?.formatted &&
              +balance.formatted < formattedCartTotalHotpot && (
                <div className="mb-2 text-center ">
                  <span className="reservoir-headings text-[#FF6369]">
                    Insufficient balance{' '}
                  </span>
                  <FormatCrypto
                    amount={+balance.formatted}
                    address={cartCurrency?.contract}
                    decimals={cartCurrency?.decimals}
                  />
                </div>
              )}
            {!formattedCartTotal ? (
              <button
                onClick={async () => {
                  await handleSubmit()
                }}
                disabled={
                  cartCount === 0 ||
                  waitingTx ||
                  Boolean(
                    balance?.formatted &&
                      +balance.formatted < formattedCartTotalHotpot
                  )
                }
                className="w-full btn-primary-fill"
              >
                {waitingTx ? 'Waiting' : 'Purchase'}
              </button>
            ) : (
              <>
                {balance?.formatted && +balance.formatted < formattedCartTotal && (
                  <div className="mb-2 text-center ">
                    <span className="reservoir-headings text-[#FF6369]">
                      Insufficient balance{' '}
                    </span>
                    <FormatCrypto
                      amount={+balance.formatted}
                      address={cartCurrency?.contract}
                      decimals={cartCurrency?.decimals}
                    />
                  </div>
                )}
                <button
                  onClick={() => signer && execute(signer)}
                  disabled={
                    cartCount === 0 ||
                    waitingTx ||
                    Boolean(
                      balance?.formatted &&
                        +balance.formatted < formattedCartTotal
                    )
                  }
                  className="w-full btn-primary-fill"
                >
                  {waitingTx ? 'Waiting' : 'Purchase'}
                </button>
              </>
            )}
          </>
        ) : (
          <ConnectWalletButton className="w-full">
            <span>Connect Wallet</span>
          </ConnectWalletButton>
        )}
      </StyledContent>
    </Popover.Root>
  )
}
export default CartMenu

interface TicketProps {
  text: string
}
const Ticket: React.FC<TicketProps> = ({ text }) => {
  return (
    <div
      className={`reservoir-h1 z-10 ml-6 flex h-[28px] w-[60px] items-center justify-center truncate whitespace-normal bg-[url('/tix.svg')] bg-cover bg-no-repeat px-1 text-center text-xs font-medium text-[#FAF9FE]`}
    >
      {text}
    </div>
  )
}
