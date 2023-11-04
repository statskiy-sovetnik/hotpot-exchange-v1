import {
  useCollectionActivity,
  useUsersActivity,
} from '@reservoir0x/reservoir-kit-ui'
import ButtonGradient from 'components/ButtonGradient'
import ActivityTable from 'components/tables/ActivityTable'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { HotpotListing } from 'types/hotpot'

type Props = {
  user?: string
  hotpotListing?: HotpotListing[]
  url: string
}

type ActivityQuery = NonNullable<
  Exclude<Parameters<typeof useUsersActivity>['1'], boolean>
>
type ActivityTypes = Exclude<ActivityQuery['types'], string>

const UserActivityTab: FC<Props> = ({ user, hotpotListing, url }) => {
  const [activityTypes, setActivityTypes] = useState<ActivityTypes>([])
  const query: ActivityQuery = {
    limit: 20,
    types: activityTypes,
  }
  const data = useUsersActivity(user ? [user] : undefined, query, {
    revalidateOnMount: false,
    fallbackData: [],
    revalidateFirstPage: true,
  })

  useEffect(() => {
    data.mutate()
    return () => {
      data.setSize(1)
    }
  }, [])

  return (
    <ActivityTable
      hotpotListing={hotpotListing}
      url={url}
      data={data}
      types={activityTypes}
      onTypesChange={(types) => {
        setActivityTypes(types)
      }}
      emptyPlaceholder={
        <div className="mt-[100px] flex flex-col items-center justify-center gap-6 text-xl font-semibold">
          <div className="text-2xl font-medium reservoir-h1">
            No activity found
          </div>
          <Link href={`/`} legacyBehavior={true}>
            <ButtonGradient>
              <span className="px-10">Explore</span>
            </ButtonGradient>
          </Link>
        </div>
      }
    />
  )
}

export default UserActivityTab
