import { Address } from 'wagmi'
import fetcher from './fetcher'

const HOTPOT_API = process.env.NEXT_PUBLIC_HOTPOT_API

export interface GetLeaderboardDataRequest {
  page: number
}

export interface GetRecentHotpotDataResponse
  extends Array<{
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
  }> {}

const getRecentHotpotData = async ({
  page,
}: GetLeaderboardDataRequest): Promise<
  GetRecentHotpotDataResponse | undefined
> => {
  try {
    const response: GetRecentHotpotDataResponse = await fetcher(
      `${HOTPOT_API}/order/recent?chain=mainnet&page=${page}`
    )

    return response
  } catch (e) {
    console.error('Error from getRecentHotpotData: ', e)
    return
  }
}

export default getRecentHotpotData
