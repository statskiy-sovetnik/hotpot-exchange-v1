import { ethers } from 'ethers'
import fetcher from './fetcher'

const getTicketCost = async (): Promise<string | null> => {
  try {
    const response = await fetcher('https://api.metalistings.xyz/ticket_price')

    return ethers.utils.formatEther(response.ticket_price)
  } catch (err) {
    console.error('Error fetching ticket price from API:', err)
    return null
  }
}

export default getTicketCost
