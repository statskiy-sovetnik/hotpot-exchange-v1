import useSWRInfinite from 'swr/infinite'
const fetcher = (url: string) => fetch(url).then((res) => res.json())
const HOTPOT_API = process.env.NEXT_PUBLIC_HOTPOT_API
const useRecentHotpotData = () => {
  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) => `${HOTPOT_API}/order/recent?chain=mainnet&page=${index}`,
    fetcher
  )
  return { data, error, mutate, size, setSize, isValidating }
}

export default useRecentHotpotData
