import getTicketCost from 'lib/getTicketCost'
import useSWR from 'swr'

const useTicketCost = () => {
  const { data, error, mutate } = useSWR(
    ['getTicketCost'],
    () => getTicketCost(),
    {
      refreshInterval: 3000000, // Refresh every 5 minutes (5 * 60 * 1000 milliseconds)
    }
  )
  return { data, error, mutate }
}

export default useTicketCost
