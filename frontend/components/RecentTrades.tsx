import { ethers } from 'ethers'
import useMounted from 'hooks/useMounted'
import Link from 'next/link'
import { FC } from 'react'
import { useEnsName } from 'wagmi'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { GetTradeDataResponseItem } from 'lib/getTrades'
import useRecentTrades from 'hooks/useRecentTrades'
import { formatBN } from 'lib/numbers'
import useTix from 'lib/tix'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

interface RecentItemRowProps {
  item: GetTradeDataResponseItem
  index: number
}

const RecentTrades: FC = () => {
  const { data: recentTrades } = useRecentTrades()
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="no-scrollbar flex max-h-[540px] overflow-x-hidden overflow-y-hidden  rounded-lg bg-white pb-2 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 md:mt-0 md:overflow-x-auto ">
        <table className="w-full">
          <thead className="z-5 sticky top-0 border-b bg-white ring-1 ring-neutral-100 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 ">
            <tr className="mx-4 px-4 text-center dark:border-b-0 ">
              <th className="px-6 py-4 text-left text-sm font-medium text-[#747474] dark:text-neutral-300 md:py-4">
                Name
              </th>
              <th className="py-4 text-center text-sm font-medium text-[#747474] dark:text-neutral-300  md:py-4">
                Ticket
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[#747474] dark:text-neutral-300  md:py-4">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {recentTrades
              ? recentTrades
                  ?.slice(0, 8)
                  .map((item, index) => (
                    <RecentItemRow key={index} item={item} index={index} />
                  ))
              : Array(15)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={index}>
                      <td className="grid min-h-[2px] animate-pulse rounded-lg bg-white dark:border-neutral-600 dark:bg-neutral-900">
                        <div className="mt-auto px-2 py-3">
                          <div className="aspect-w-1 aspect-h-1 relative">
                            <div className="dark-bg-neutral-800 mb-0 h-full bg-neutral-100"></div>
                          </div>
                          <div className="flex items-center justify-between ">
                            <div className="dark-bg-neutral-800 mr-14 h-4 w-[30%] rounded-md bg-neutral-200"></div>
                            <div className="dark-bg-neutral-800 h-4 w-[15%] rounded-md bg-neutral-200"></div>
                            <div className="dark-bg-neutral-800 h-4 w-[20%] rounded-md bg-neutral-200"></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default RecentTrades
const RecentItemRow: FC<RecentItemRowProps> = ({ item }) => {
  const address = ethers.utils.getAddress(item.buyer)
  const { data: ensName } = useEnsName({ address: address })
  const hotpotPrice = ethers.utils.formatEther(
    item?.offer_amount?.toString() || '0'
  )

  const formattedPrice = formatBN(parseFloat(hotpotPrice), 2, 18)
  const tix = useTix(hotpotPrice ?? '0')
  dayjs.extend(relativeTime)
  const time = dayjs(item.updated_at).fromNow()

  return (
    <tr key={item.updated_at} className="m-2 text-center text-sm dark:border-0">
      <td className="px-4 py-3 text-left md:w-3/5 md:px-4 ">
        <Link href={`/address/${item.buyer}`} legacyBehavior={true}>
          <a className="justify-left flex cursor-pointer flex-row items-center gap-4 rounded outline-none transition hover:text-purple-700 focus:text-purple-700 dark:hover:text-purple-500">
            <Jazzicon
              diameter={30}
              seed={jsNumberForAddress(item.buyer || '')}
            />
            {ensName ? (
              <div className="p-2 text-left text-sm font-medium">{ensName}</div>
            ) : (
              <>
                <div className="hidden w-2/5 p-2 text-left text-sm font-medium md:flex">
                  {`${item.buyer.slice(0, 5)}...${item.buyer.slice(-5)}`}
                </div>

                <div className="w-2/4 p-2 text-left text-sm font-medium md:hidden">
                  {`${item.buyer.slice(0, 5)}...${item.buyer.slice(-5)}`}
                </div>
              </>
            )}
          </a>
        </Link>
      </td>

      <td className="p-2 text-center font-medium text-[#620DED] dark:text-violet-500 ">
        +{tix}
      </td>
      <td className="p-2 pr-4 text-right">{time}</td>
    </tr>
  )
}
