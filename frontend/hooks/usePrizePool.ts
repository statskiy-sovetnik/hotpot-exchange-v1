import getPrizePool from 'lib/getPrizePool'
import useSWR from 'swr'

const usePrizePool = () => {
  const { data, error, mutate } = useSWR(
    ['getPrizePool'],
    () => getPrizePool(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes (5 * 60 * 1000 milliseconds)
    }
  )

  return { data, error, mutate }
}

export default usePrizePool
