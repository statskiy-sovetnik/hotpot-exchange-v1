import { FC } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { toggleOnItem } from 'lib/router'
import { useRouter } from 'next/router'
import Leaderboard from './Leaderboard'
import PastWinners from './PastWinners'
let tabs = [
  { name: 'Leaderboard', id: 'leaderboard' },
  { name: 'Past Winners', id: 'winners' },
]

const RewardsTab: FC = () => {
  const router = useRouter()
  return (
    <div className="mt-8">
      {' '}
      <Tabs.Root value={router.query?.tab?.toString() || 'leaderboard'}>
        <Tabs.List className="no-scrollbar mb-4 ml-[-15px] flex w-[calc(100%_+_30px)] overflow-y-scroll border-b border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.2)] md:ml-0 md:w-full">
          {tabs.map(({ name, id }) => (
            <Tabs.Trigger
              key={id}
              id={id}
              value={id}
              className={
                'group relative min-w-0  shrink-0 whitespace-nowrap border-b-2 border-transparent py-4 px-8  text-center text-sm font-medium hover:text-gray-700 focus:z-10 radix-state-active:border-[#620DED] radix-state-active:text-[#620DED] dark:text-white dark:radix-state-active:border-primary-900'
              }
              onClick={() => toggleOnItem(router, 'tab', id)}
            >
              <span>{name}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="leaderboard" className="col-span-full">
          <Leaderboard />
        </Tabs.Content>

        <Tabs.Content value="winners" className="col-span-full">
          <PastWinners />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default RewardsTab
