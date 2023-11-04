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
  tickets24h: number
  totalTickets: number
}

interface LeaderboardItemRowProps {
  item: LeaderboardItem
}

const Rank1Badge = '/rank1.svg'
const Rank2Badge = '/rank2.svg'
const Rank3Badge = '/rank3.svg'

const RankBadge = (rank: number) => {
  if (rank === 1) {
    return (
      <img
        src={Rank1Badge}
        alt="Rank 1 Badge"
        className="h-8 w-8 flex-grow items-center"
      />
    )
  } else if (rank === 2) {
    return (
      <img
        src={Rank2Badge}
        alt="Rank 2 Badge"
        className="h-8 w-8 flex-grow items-center"
      />
    )
  } else if (rank === 3) {
    return (
      <img
        src={Rank3Badge}
        alt="Rank 3 Badge"
        className="h-8 w-8 flex-grow items-center"
      />
    )
  } else {
    return <span className="m-1 flex-grow text-sm font-medium">#{rank}</span>
  }
}

const LeaderboardItemRow: FC<LeaderboardItemRowProps> = ({ item }) => {
  const address = ethers.utils.getAddress(item.name)
  const { data: ensName } = useEnsName({ address: address })

  return (
    <tr key={item.rank} className="text-center text-sm dark:border-0">
      <td className="flex items-center px-2 py-4 md:px-2">
        {RankBadge(item.rank)}
      </td>
      <td className="px-2 py-4 text-left md:w-1/3 md:px-2">
        <Link
          href={`/address/${item.name}`}
          legacyBehavior={true}
          className="hover:translate-x-2 hover:translate-y-2"
        >
          <a
            href={`/address/${item.name}`}
            className="hover:translate-y-2 hover:text-violet-900 dark:hover:text-violet-500"
          >
            {ensName ? (
              <span className="flex-grow text-sm font-medium">{ensName}</span>
            ) : (
              <span className="flex-grow text-sm font-medium">{`${item.name.slice(
                0,
                4
              )}...${item.name.slice(-4)}`}</span>
            )}
          </a>
        </Link>
      </td>
      <td className="px-2 py-4 text-right md:px-4">
        <span className="flex-grow text-sm font-medium">{item.boost}</span>
      </td>
      <td className="px-2 py-4 text-center md:px-4">
        <span className="flex-grow text-sm font-semibold">
          {item.totalTickets}
        </span>
      </td>
    </tr>
  )
}

const LeaderboardTicketHolder: FC = () => {
  const { data } = useLeaderboardData({ potId: 3, chain: 'mainnet' })
  const account = useAccount()
  const isMounted = useMounted()

  const leaderboardItems: Array<LeaderboardItem> = useMemo(() => {
    return (
      data
        ?.sort((prev, next) => next.num_of_tickets - prev.num_of_tickets)
        .map((item, item_idx) => ({
          rank: item_idx + 1,
          name: item.wallet_address as string,
          boost: '1x',
          tickets24h: NaN,
          totalTickets: item.num_of_tickets,
        })) || []
    )
  }, [data])

  if (!isMounted) {
    return null
  }

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

  return (
    <>
      <div className="no-scrollbar flex max-h-[540px] overflow-y-auto overflow-x-hidden  rounded-lg bg-white  dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 md:mt-0 md:overflow-x-auto ">
        <table className="mb-2 w-full table-auto">
          <thead className="z-5 sticky top-0 border-b bg-white ring-1 ring-neutral-100 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 ">
            <tr className="mx-4 px-4 text-center dark:border-b-0 ">
              <th className="py-4 text-center text-sm font-medium text-[#747474] dark:text-neutral-300 md:py-4">
                Rank
              </th>
              <th className="py-4 text-left text-sm font-medium text-[#747474] dark:text-neutral-300 md:py-4">
                Name
              </th>
              <th className="py-4 text-right text-sm font-medium text-[#747474] dark:text-neutral-300 md:py-4">
                Boost{' '}
                <InfoTooltip
                  side="top"
                  width={200}
                  content="Ticket Multiplier"
                />
              </th>
              <th className="py-4 text-center text-sm  font-medium text-[#747474] dark:text-neutral-300 md:py-4">
                <span className="md:hidden">Tickets</span>{' '}
                <span className="hidden md:block">Total Tickets</span>
              </th>
            </tr>
          </thead>

          {/* show user ranking on top when connected */}
          <tbody>
            {account.isConnected && userItem ? (
              <tr
                key={userItem.rank}
                className="bg-violet-100 text-center text-sm dark:bg-neutral-800"
              >
                <td className="flex items-center px-2 py-2 md:px-2">
                  {userItem.rank === 1 ? (
                    <img
                      src={Rank1Badge}
                      alt="Rank 1 Badge"
                      className="h-8 w-8 flex-grow items-center"
                    />
                  ) : userItem.rank === 2 ? (
                    <img
                      src={Rank2Badge}
                      alt="Rank 2 Badge"
                      className="h-8 w-8 flex-grow items-center"
                    />
                  ) : userItem.rank === 3 ? (
                    <img
                      src={Rank3Badge}
                      alt="Rank 3 Badge"
                      className="h-8 w-8 flex-grow items-center"
                    />
                  ) : (
                    <span className="font-base flex-grow p-2 text-sm">
                      {userItem.rank}
                    </span>
                  )}
                </td>

                <td className="w-1/3 px-2 py-4 text-left md:px-4 ">
                  <Link
                    href={`/address/${userItem.name}`}
                    legacyBehavior={true}
                    className="hover:translate-x-2 hover:translate-y-2"
                  >
                    <a
                      href={`/address/${userItem.name}`}
                      className="hover:translate-y-2 hover:text-violet-900 dark:hover:text-violet-500"
                    >
                      <span className="flex-grow text-sm font-medium">You</span>
                    </a>
                  </Link>
                </td>

                <td className="px-2 py-4 text-right md:px-4">
                  <span className="flex-grow text-sm font-medium">
                    {userItem.boost}
                  </span>
                </td>
                <td className="px-2 py-4 text-center md:px-4 ">
                  <span className="flex-grow text-sm font-semibold">
                    {userItem.totalTickets}
                  </span>
                </td>
              </tr>
            ) : null}

            {/* leaderboard items except the user */}
            {leaderboardItems
              .filter(
                (item) =>
                  item.name.toLowerCase() !== account.address?.toLowerCase()
              )
              .slice(0, 10)
              .map((item) => (
                <LeaderboardItemRow key={item.rank} item={item} />
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default LeaderboardTicketHolder
