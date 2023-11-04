import { Address } from 'wagmi'
import fetcher from './fetcher'

const HOTPOT_API = process.env.NEXT_PUBLIC_HOTPOT_API

export interface GetTradeDataResponseItem {
  chain: number
  offerer: Address
  offer_token: Address
  offer_token_id: number
  offer_amount: string
  updated_at: string
  buyer: Address
  ticket_amount: number
}

const getTrades = async (): Promise<GetTradeDataResponseItem[] | undefined> => {
  try {
    const response: GetTradeDataResponseItem[] = await fetcher(
      `https://api.metalistings.xyz/order/trades?chain=mainnet`
    )
    return response
  } catch (e) {
    console.error('Error from getTradesData: ', e)
    return
  }
}

export default getTrades
