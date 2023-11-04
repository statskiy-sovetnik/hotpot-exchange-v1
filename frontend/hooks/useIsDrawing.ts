import { getIsDrawing } from 'lib/getIsDrawing'
import useSWR from 'swr'

const useIsDrawing = () => {
  const { data, error, mutate } = useSWR(['getPotDraw'], () => getIsDrawing(), {
    refreshInterval: 60000, // Refresh every 1 minute (1 * 60 * 1000 milliseconds)
    revalidateOnReconnect: false,
    revalidateOnFocus: true,
  })

  return { data, error, mutate }
}

export default useIsDrawing
