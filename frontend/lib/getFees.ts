const getFees = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://api.metalistings.xyz/hotpot_fee')
    const hotpotFee = await response.json()

    // Return the 'ticket_price' value as a number
    return hotpotFee.ticket_price
  } catch (err) {
    console.error('Error fetching ticket price from API:', err)
    return null
  }
}

export default getFees
