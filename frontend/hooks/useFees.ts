import getFees from 'lib/getFees'
import useSWR from 'swr'

const useFees = () => {
  const { data, error, mutate } = useSWR(['getFees'], () => getFees(), {
    refreshInterval: 300000,
  })
  return { data, error, mutate }
}

export default useFees
