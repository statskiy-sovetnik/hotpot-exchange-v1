import { Address } from 'wagmi'
import fetcher from './fetcher'

export interface GetLeaderboardDataRequest {
  potId: number
  chain: 'mainnet'
}

export interface GetLeaderboardDataResponseItem {
  num_of_tickets: number
  wallet_address: Address
  pot_id: number
}

const getLeaderboardData = async ({
  potId,
  chain,
}: GetLeaderboardDataRequest): Promise<
  GetLeaderboardDataResponseItem[] | undefined
> => {
  try {
    let latestPotId = 1 // Default to 1

    const latestRafflePot: GetLeaderboardDataResponseItem | undefined =
      await fetcher(
        `https://api.metalistings.xyz/pot/latest_raffle?chain=mainnet`
      )

    if (latestRafflePot && typeof latestRafflePot.pot_id === 'number') {
      latestPotId = latestRafflePot.pot_id + 1
    }

    const response: GetLeaderboardDataResponseItem[] = await fetcher(
      `https://api.metalistings.xyz/pot/${latestPotId}/leaderboard?chain=mainnet`
    )
    return response
  } catch (e) {
    console.error('Error from getLeaderboardData: ', e)
    return
  }
}

export default getLeaderboardData
