export interface PotData {
  NumOfTickets: number
  wallet_address: string
  pot_id: number
  tickets: { ticket_id: number; is_winner: boolean }[]
}

export const getResult = async (user: string): Promise<PotData | null> => {
  try {
    const latestRaffleResponse = await fetch(
      'https://api.metalistings.xyz/pot/latest_raffle?chain=mainnet'
    )
    const potIdResponse = await latestRaffleResponse.json()
    const potId = potIdResponse.pot_id

    const userPotResponse = await fetch(
      `https://api.metalistings.xyz/user/${user}/pot/${potId}?chain=mainnet`
    )
    const potDetails: PotData = await userPotResponse.json()

    // Make a request for potId-1
    const userPotResponse2 = await fetch(
      `https://api.metalistings.xyz/user/${user}/pot/${potId - 1}?chain=mainnet`
    )
    const potDetails2: PotData = await userPotResponse2.json()

    // Merge the two PotData objects
    const combinedPotData: PotData = {
      NumOfTickets: potDetails.NumOfTickets + potDetails2.NumOfTickets,
      wallet_address: potDetails.wallet_address,
      pot_id: potDetails.pot_id,
      tickets: [...potDetails.tickets, ...potDetails2.tickets],
    }

    return combinedPotData
  } catch (error) {
    console.error('Error fetching pot data:', error)
    return null
  }
}
