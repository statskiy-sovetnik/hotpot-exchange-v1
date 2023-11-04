import { getRafflePotId } from 'lib/getRafflePotId'
import useSWR from 'swr'

const useRafflePotId = () => {
  const { data, error, mutate } = useSWR('getRafflePotId', getRafflePotId, {
    revalidateOnMount: true, // This option revalidates on component mount
  })

  return { data, error, mutate }
}

export default useRafflePotId
