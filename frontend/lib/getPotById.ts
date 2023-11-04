export interface PotData {
  NumOfTickets: number
  wallet_address: string
  pot_id: number
  tickets: { ticket_id: number; is_winner: boolean; pending_amount: string }[]
}

export const getPotById = async (
  user: string,
  potId: number
): Promise<PotData | null> => {
  try {
    const userPotResponse = await fetch(
      `https://api.metalistings.xyz/user/${user}/pot/${potId}?chain=mainnet`
    )
    const potDetails = await userPotResponse.json()
    return potDetails
  } catch (error) {
    console.error('Error fetching pot data:', error)
    return null
  }
}
