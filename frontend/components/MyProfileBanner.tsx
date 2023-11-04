import Link from 'next/link'
import { FC, useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaInfoCircle, FaQuestionCircle } from 'react-icons/fa'

const MyProfileBanner: FC = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true)

  const handleBannerClose = () => {
    setIsBannerVisible(false)
    sessionStorage.setItem('bannerVisibility', 'hidden')
  }

  useEffect(() => {
    const bannerVisibility = sessionStorage.getItem('bannerVisibility')
    if (bannerVisibility === 'hidden') {
      setIsBannerVisible(false)
    }
  }, [])

  if (!isBannerVisible) {
    return null
  }

  return (
    <div className="my-4 grid w-full grid-cols-3 items-center justify-between gap-1 rounded-lg bg-[#FDF1D0] p-2 md:grid-cols-3">
      <div className="reservoir-h1 col-span-2 flex flex-row items-center justify-start gap-1 px-2 py-2 text-sm font-medium text-black dark:text-black md:px-4 md:text-base">
        <FaInfoCircle className="h-10 w-10 p-2 text-[#E4AD02] md:h-8 md:w-8" />
        <span className="text-xs md:text-sm">
          What next? List an NFT and earn raffle tickets upon its sale
        </span>
      </div>
      <div className="w-1/ reservoir-h1 col-span-1 flex flex-row items-center justify-end gap-1 px-2 py-2 text-sm font-medium md:px-4 md:text-base">
        <Link href="/how-it-works" legacyBehavior={true}>
          <a
            href="/how-it-works"
            className="text-xs text-black underline md:text-sm"
          >
            How it Works
            <FaQuestionCircle className="hidden h-8 w-8 p-2 text-black md:inline-flex " />
          </a>
        </Link>
        <button onClick={handleBannerClose}>
          <AiOutlineClose className="h-8 w-8 p-2 text-black" />
        </button>
      </div>
    </div>
  )
}

export default MyProfileBanner
