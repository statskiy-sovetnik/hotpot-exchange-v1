import fetcher from './fetcher'

export interface HotpotActivityData {
  order_hash: string
  created_at: string
  status: number
  buyer: string
  offerer: string
  offer_token: string
  offer_token_id: number
  offer_amount: number
  end_time: number
  royalty_percent: number
  royalty_recipient: string
  salt: number
  total_price: number
}

export const getHotpotActivity = async (
  user: string
): Promise<HotpotActivityData[] | undefined> => {
  try {
    const userPotResponse = await fetch(
      `https://api.metalistings.xyz/order/user/${user}/history?chain=mainnet`
    )
    const hotpotActivity: HotpotActivityData[] = await userPotResponse.json()

    return hotpotActivity
  } catch (error) {
    return undefined
  }
}
