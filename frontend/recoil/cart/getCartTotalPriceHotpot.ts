import { selector } from 'recoil'
import recoilCartTokens from 'recoil/cart'
import { ethers } from 'ethers'

export default selector({
  key: 'cartTotalHotpot',
  get: ({ get }) => {
    const cartTokens = get(recoilCartTokens)

    const totalPricesPromises = cartTokens.map((token) => {
      const { hotpotListing } = token

      if (hotpotListing) {
        const price = ethers.utils.formatEther(
          hotpotListing.total_price.toString()
        )
        return Number(price) || 0
      }

      return 0 // Default to 0 if hotpotListing is undefined
    })

    const cartTotalHotpot = totalPricesPromises.reduce(
      (total, price) => total + price,
      0
    )

    return cartTotalHotpot
  },
})
