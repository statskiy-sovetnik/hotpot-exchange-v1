import { ethers } from 'ethers'
import useLeaderboardData from 'hooks/useLeaderboardData'
import useMounted from 'hooks/useMounted'
import Link from 'next/link'
import { FC, useMemo } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { useAccount, useEnsName } from 'wagmi'
import InfoTooltip from './InfoTooltip'

interface LeaderboardItem {
  rank: number
  name: string
  boost: string
  tickets24h?: number
  totalTickets: number
}
interface LeaderboardItemRowProps {
  item: LeaderboardItem
}

const Rank1Badge = '/rank1.svg'
const Rank2Badge = '/rank2.svg'
const Rank3Badge = '/rank3.svg'

const Leaderboard: FC = () => {
  const account = useAccount()
  const { data } = useLeaderboardData({ potId: 3, chain: 'mainnet' })
  const isMounted = useMounted()
  const leaderboardItems: Array<LeaderboardItem> = useMemo(() => {
    return (
      data
        ?.sort((prev, next) => next.num_of_tickets - prev.num_of_tickets)
        .map((item, item_idx) => ({
          rank: item_idx + 1,
          name: item.wallet_address as string,
          boost: '1x',
          tickets24h: 0,
          totalTickets: item.num_of_tickets,
        })) || []
    )
  }, [data])

  // Find the user's leaderboard item
  const userItem = leaderboardItems.find(
    (item) => item.name.toLowerCase() === account.address?.toLowerCase()
  ) || {
    rank: '-',
    name: account.address,
    boost: '1x',
    tickets24h: 0,
    totalTickets: 0,
  }
  if (!isMounted) {
    return null
  }
  return (
    <div>
      <div className="no-scrollbar max-h-[602px] w-full overflow-x-hidden rounded-lg border px-2 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 md:px-4">
        <table className="w-full mb-0">
          <thead className="sticky top-0 bg-white z-5 ring-b text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr className="text-xs text-center md:text-medium md:text-sm">
              <th className="py-4 font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Rank
              </th>
              <th className="py-4 text-left font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Name
              </th>
              <th className="py-4 text-center font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Boost{' '}
                <InfoTooltip
                  side="top"
                  width={200}
                  content="Ticket Multiplier"
                />
              </th>
              <th className="hidden py-2 text-center font-medium text-[#747474] dark:text-neutral-300 md:block md:p-4">
                24h Tickets
              </th>
              <th className="py-4 text-center font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                <span className="md:hidden">Tickets</span>
                <span className="hidden md:block">Total Tickets</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {account.isConnected && userItem ? (
              <tr
                key={userItem.rank}
                className="m-2 text-sm bg-violet-100 dark:bg-neutral-800"
              >
                <td className="flex flex-row items-center justify-center py-2 md:px-2">
                  {userItem.rank === 1 ? (
                    <img
                      src={Rank1Badge}
                      alt="Rank 1 Badge"
                      className="items-center flex-grow w-8 h-8"
                    />
                  ) : userItem.rank === 2 ? (
                    <img
                      src={Rank2Badge}
                      alt="Rank 2 Badge"
                      className="items-center flex-grow w-8 h-8"
                    />
                  ) : userItem.rank === 3 ? (
                    <img
                      src={Rank3Badge}
                      alt="Rank 3 Badge"
                      className="items-center flex-grow w-8 h-8"
                    />
                  ) : (
                    <span className="items-center p-2 text-sm text-center font-base align-center">
                      {userItem.rank}
                    </span>
                  )}
                </td>
                <td className="py-2 text-left md:w-1/3 md:px-4">
                  <Link
                    href={`/address/${userItem.name}`}
                    legacyBehavior={true}
                  >
                    <a className="transition rounded outline-none cursor-pointer hover:text-purple-700 focus:text-purple-700">
                      <h2 className="hidden w-1/3 p-2 font-medium text-left md:flex">
                        You
                      </h2>
                      <h2 className="w-1/3 p-2 font-medium text-left md:hidden">
                        You
                      </h2>
                    </a>
                  </Link>
                </td>
                <td className="py-2 px-2 text-center text-[#0FA46E]">
                  {userItem.boost}
                </td>
                <td className="hidden p-2 text-center md:table-cell">
                  {userItem.tickets24h}
                </td>
                <td className="px-2 py-2 text-center">
                  {userItem.totalTickets}
                </td>
              </tr>
            ) : null}
            {/* leaderboard items except the user */}
            {leaderboardItems
              .filter(
                (item) =>
                  item.name.toLowerCase() !== account.address?.toLowerCase()
              )
              .map((item) => (
                <LeaderboardItemRow key={item.rank} item={item} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Leaderboard

const RankBadge = (rank: number) => {
  if (rank === 1) {
    return (
      <img
        src={Rank1Badge}
        alt="Rank 1 Badge"
        className="items-center flex-grow w-8 h-8"
      />
    )
  } else if (rank === 2) {
    return (
      <img
        src={Rank2Badge}
        alt="Rank 2 Badge"
        className="items-center flex-grow w-8 h-8"
      />
    )
  } else if (rank === 3) {
    return (
      <img
        src={Rank3Badge}
        alt="Rank 3 Badge"
        className="items-center flex-grow w-8 h-8"
      />
    )
  } else {
    return <span className="flex-grow p-2 text-sm font-medium">{rank}</span>
  }
}
const LeaderboardItemRow: FC<LeaderboardItemRowProps> = ({ item }) => {
  const address = ethers.utils.getAddress(item.name)
  const { data: ensName } = useEnsName({ address: address })

  return (
    <tr
      key={item.rank}
      className="m-2 text-sm text-center border-b dark:border-0"
    >
      <td className="flex flex-row items-center justify-center px-2 py-4">
        {RankBadge(item.rank)}
      </td>
      <td className="px-2 py-4 text-left md:w-1/3 md:px-4 ">
        <Link href={`/address/${item.name}`} legacyBehavior={true}>
          <a className="transition rounded outline-none cursor-pointer hover:text-purple-700 focus:text-purple-700 dark:hover:text-purple-500">
            {ensName ? (
              <div className="p-2 font-medium text-left ">{ensName}</div>
            ) : (
              <>
                <div className="hidden w-1/3 p-2 font-medium text-left md:flex">
                  {`${item.name.slice(0, 7)}...${item.name.slice(-7)}`}
                </div>

                <div className="w-1/3 p-2 font-medium text-left md:hidden">
                  {`${item.name.slice(0, 5)}...${item.name.slice(-5)}`}
                </div>
              </>
            )}
          </a>
        </Link>
      </td>
      <td className="p-2 text-center text-[#0FA46E]">{item.boost}</td>
      <td className="hidden p-2 text-center md:table-cell">
        {item.tickets24h}
      </td>
      <td className="p-2 text-center">{item.totalTickets}</td>
    </tr>
  )
}
