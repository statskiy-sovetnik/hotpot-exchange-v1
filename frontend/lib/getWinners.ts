import { Address } from 'wagmi'
import fetcher from './fetcher'

export interface GetWinnerDataResponseItem {
  wallet_address: Address
  ticket_id: number
  pot_id: number
  pot_size: string
  tx_hash: string
  vrf_tx_hash?: string
  raffle_timestamp: string
  claim_hash?: string
}

const getWinners = async (): Promise<
  GetWinnerDataResponseItem[] | undefined
> => {
  try {
    const response: GetWinnerDataResponseItem[] = await fetcher(
      `https://api.metalistings.xyz/pot/winners?chain=mainnet`
    )
    return response
  } catch (e) {
    console.error('Error from getWinnerData: ', e)
    return
  }
}

export default getWinners
