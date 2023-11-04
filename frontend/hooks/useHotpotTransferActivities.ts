import { getHotpotActivity } from 'lib/getHotpotActivity'
import useSWR from 'swr'

const fetchHotpotActivityByAddress = (address: string) =>
  getHotpotActivity(address)
const useHotpotActivityByAddress = (address: string) => {
  const { data, error } = useSWR(['hotpotActivity', address], () =>
    fetchHotpotActivityByAddress(address)
  )

  return { data, error }
}

export default useHotpotActivityByAddress
