import { ethers } from 'ethers'
import fetcher from './fetcher'

export type Item = {
  currentPotSize: string
  potLimit: string
}

const getPrizePool = async (): Promise<Item | null> => {
  try {
    const response = await fetcher('https://api.metalistings.xyz/pot_info')
    const currentPotSize = ethers.utils.formatEther(response.pot_size)
    const potLimit = ethers.utils.formatEther(response.pot_limit)

    const prizePool: Item = {
      currentPotSize,
      potLimit,
    }
    return prizePool
  } catch (err) {
    console.error('Error fetching ticket price from API:', err)
    return null
  }
}

export default getPrizePool
