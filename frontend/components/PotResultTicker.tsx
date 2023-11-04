import { FC, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import ResultsModal from './modal/ResultsModal'
import Marquee from 'react-fast-marquee'
import { getRafflePot } from 'lib/getRafflePot'

const BANNER_STORAGE_KEY = 'raffleResultsBannerShown'
const ADDRESS_STORAGE_KEY = 'userAddress'
const POT_ID_STORAGE_KEY = 'userPotId'

const marqueeItemArray = [
  {
    imgUrl: '/new/star24.svg',
    text: 'Pot O’ Gold Raffle has Drawn, CHECK RESULTS',
  },
  {
    imgUrl: '/new/star24.svg',
    text: 'Pot O’ Gold Raffle has Drawn, CHECK RESULTS',
  },
  {
    imgUrl: '/new/star24.svg',
    text: 'Pot O’ Gold Raffle has Drawn, CHECK RESULTS',
  },
  {
    imgUrl: '/new/star24.svg',
    text: 'Pot O’ Gold Raffle has Drawn, CHECK RESULTS',
  },
]

interface MarqueeItemProps {
  iconUrl: string
  text: string
  onClose?: () => void
}
const MarqueeItem: FC<MarqueeItemProps> = ({ iconUrl, text, onClose }) => {
  return (
    <div className="flex items-center gap-[16px]">
      <img src={iconUrl} className="pl-4" />
      <ResultsModal
        trigger={
          <a className="z-[1000000000] cursor-pointer">
            <span className="text-center text-[16px] uppercase text-white">
              {text}
            </span>
          </a>
        }
        onClose={onClose}
      />
    </div>
  )
}

const PotResultTicker: FC = () => {
  const { isConnected, address } = useAccount()
  const [isRaffleDrawn, setIsRaffleDrawn] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(false)

  const handleBannerClose = () => {
    setIsBannerVisible(false)
    sessionStorage.setItem(BANNER_STORAGE_KEY, 'false')
  }

  useEffect(() => {
    if (address) {
      getRafflePot(address).then((res) => {
        const storedAddress = sessionStorage.getItem(ADDRESS_STORAGE_KEY)

        const storedPotId = sessionStorage.getItem(POT_ID_STORAGE_KEY)
        if (
          res?.pot_id &&
          res?.pot_id.toString() !== storedPotId &&
          address &&
          address.toString().toLowerCase() !== storedAddress?.toLowerCase()
        ) {
          // Pot ID or address has changed, reset everything
          setIsBannerVisible(true)
          sessionStorage.setItem(BANNER_STORAGE_KEY, 'true')
          sessionStorage.setItem(ADDRESS_STORAGE_KEY, address)
          sessionStorage.setItem(
            POT_ID_STORAGE_KEY,
            res?.pot_id.toString() || ''
          )
        }
        setIsRaffleDrawn(true)
        const isBannerAlreadyShown = sessionStorage.getItem(BANNER_STORAGE_KEY)

        if (!isBannerAlreadyShown) {
          setIsBannerVisible(false)
        }
      })
    }
  }, [address])

  if (isRaffleDrawn && isConnected && isBannerVisible) {
    return (
      <div className="w-full">
        <Marquee className="w-full bg-[#620DED] py-4">
          {marqueeItemArray.map((item, index) => (
            <MarqueeItem
              key={index}
              iconUrl={item.imgUrl}
              text={item.text}
              onClose={handleBannerClose}
            />
          ))}
        </Marquee>
      </div>
    )
  }

  return null
}

export default PotResultTicker
