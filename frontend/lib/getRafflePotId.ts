export interface PotResponse {
  pot_id: number
  raffle_timestamp: string
}

export const getRafflePotId = async (): Promise<PotResponse | null> => {
  try {
    const latestRaffleResponse = await fetch(
      'https://api.metalistings.xyz/pot/latest_raffle?chain=mainnet'
    )
    const potIdResponse = await latestRaffleResponse.json()
    return potIdResponse
  } catch (error) {
    console.error('Error fetching pot data:', error)
    return null
  }
}
