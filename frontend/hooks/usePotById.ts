import { PotData } from './../lib/getPotById'
import { getPotById } from 'lib/getPotById'
import useSWR from 'swr'
import { Address } from 'wagmi'

const usePotById = (address: Address, potId: number) => {
  const { data, error } = useSWR<PotData>(() => getPotById(address, potId))

  return { data, error }
}
export default usePotById
