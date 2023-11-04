import { ethers } from 'ethers'
import useMounted from 'hooks/useMounted'
import useRecentTrades from 'hooks/useRecentTrades'
import { GetTradeDataResponseItem } from 'lib/getTrades'
import useTix from 'lib/tix'
import { FC } from 'react'
import Marquee from 'react-fast-marquee'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { useEnsName } from 'wagmi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { jsNumberForAddress } from 'react-jazzicon'

interface RecentItemRowProps {
  item: GetTradeDataResponseItem
  index: number
}

const ActivitiesTicker: FC = () => {
  const { data: recentTrades } = useRecentTrades()
  const isMounted = useMounted()
  if (!isMounted) {
    return null
  }
  return (
    <div className="mt-4 w-full md:my-8">
      <Marquee className="w-full py-4">
        {recentTrades?.map((item, index) => (
          <MarqueeItem key={index} item={item} index={index} />
        ))}
      </Marquee>
    </div>
  )
}

const MarqueeItem: FC<RecentItemRowProps> = ({ item }) => {
  const address = ethers.utils.getAddress(item.buyer)
  const { data: ensName } = useEnsName({ address: address })
  const hotpotPrice = ethers.utils.formatEther(
    item?.offer_amount?.toString() || '0'
  )

  const tix = useTix(hotpotPrice ?? '0')
  dayjs.extend(relativeTime)
  const time = dayjs(item.updated_at).fromNow()

  return (
    <div className="reservoir-h1 mx-4 flex flex-row items-center gap-2 rounded-xl bg-[#F5F5F5] p-4 dark:bg-neutral-800">
      <Jazzicon diameter={32} seed={jsNumberForAddress(address || '')} />

      {ensName ? (
        <h1 className="text-base font-medium text-black dark:text-white">
          {ensName}
        </h1>
      ) : (
        <h1 className="text-base font-medium text-black dark:text-white">
          {`${item.buyer.slice(0, 7)}...${item.buyer.slice(-7)}`}
        </h1>
      )}
      <div className="flex flex-row gap-1 text-base font-normal text-black dark:text-neutral-100">
        <span>just got</span>
        <span className="font-medium text-[#620DED] dark:text-[#8B4AFF]">
          {tix} tickets
        </span>
        <span>{time}</span>
      </div>
    </div>
  )
}

export default ActivitiesTicker
