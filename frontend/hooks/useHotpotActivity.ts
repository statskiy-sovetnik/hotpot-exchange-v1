import { getHotpotActivity } from 'lib/getHotpotActivity'
import useSWR from 'swr'

const useHotpotActivity = (user: string) => {
  const { data, error, mutate } = useSWR(['useHotpotActivity', user], () =>
    getHotpotActivity(user)
  )

  return { data, error, mutate }
}

export default useHotpotActivity
