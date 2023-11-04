import getWinners from 'lib/getWinners'
import useSWR from 'swr'

const useWinners = () => {
  const { data, error, mutate } = useSWR(['getWinners'], () => getWinners())

  return { data, error, mutate }
}

export default useWinners
