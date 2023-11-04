import useMounted from 'hooks/useMounted'
import { FC } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { toggleOnItem } from 'lib/router'
import { useRouter } from 'next/router'
import RecentTrades from './RecentTrades'
import LeaderboardTicketHolder from './LeaderboardTicketHolder'
import { FiTrendingUp } from 'react-icons/fi'
import { RiLayoutGridFill } from 'react-icons/ri'

let tabs = [
  { name: 'Activities', id: 'activities', icon: <RiLayoutGridFill /> },
  { name: 'Leaderboard', id: 'leaderboard', icon: <FiTrendingUp /> },
]
const Participants: FC = () => {
  const router = useRouter()
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  return (
    <>
      <div className="justify-left mb-4 flex items-center md:mb-6">
        <h1 className="reservoir-h1 my-2 text-xl font-extrabold not-italic text-[#9659F9] md:text-2xl">
          PARTICIPANTS
        </h1>
      </div>
      <div className="rounded-lg border dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600">
        <Tabs.Root value={router.query?.tab?.toString() || 'activities'}>
          <Tabs.List className="no-scrollbar mb-0  flex  overflow-y-scroll border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.2)] md:ml-0 md:w-full">
            {tabs.map(({ name, id, icon }) => (
              <Tabs.Trigger
                key={id}
                id={id}
                value={id}
                className={
                  'group relative mx-4 min-w-0 shrink-0 whitespace-nowrap border-b-2 border-transparent py-4 px-8  text-center text-sm font-medium hover:text-gray-700 focus:z-10 radix-state-active:border-[#9659F9] radix-state-active:text-[#9659F9] dark:text-white dark:radix-state-active:border-primary-900'
                }
                onClick={() => toggleOnItem(router, 'tab', id)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="">{icon}</span>
                  <span>{name}</span>
                </div>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <Tabs.Content value="activities" className="col-span-full">
            <RecentTrades />
          </Tabs.Content>

          <Tabs.Content value="leaderboard" className="col-span-full">
            <LeaderboardTicketHolder />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  )
}

export default Participants
