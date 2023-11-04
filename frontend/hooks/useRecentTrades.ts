import getTrades from 'lib/getTrades'
import useSWR from 'swr'

const useRecentTrades = () => {
  const { data, error, mutate } = useSWR(['getTrades'], () => getTrades(), {
    refreshInterval: 1800000, // Refresh every 1 minute (1 * 60 * 1000 milliseconds)
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
  })

  return { data, error, mutate }
}

export default useRecentTrades
