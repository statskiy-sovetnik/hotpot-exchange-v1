import getTransactionData from 'lib/getTransactionData'
import useSWR from 'swr'

const useTransactionData = (transactionHash: string) => {
  if (transactionHash === '') {
    return { data: null, error: null, mutate: null }
  }

  const { data, error, mutate } = useSWR(
    ['useTransactionData', transactionHash],
    () => getTransactionData(transactionHash)
  )

  return { data, error, mutate }
}

export default useTransactionData
