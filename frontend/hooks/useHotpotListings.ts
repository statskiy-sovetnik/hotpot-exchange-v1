import useSWR from 'swr'
import fetcher from 'lib/fetcher'

const useHotpotListings = (hotpotListingsUrl: string) => {
  const { data, error, mutate } = useSWR<any>(hotpotListingsUrl, fetcher)

  return { data, error, mutate }
}

export default useHotpotListings
