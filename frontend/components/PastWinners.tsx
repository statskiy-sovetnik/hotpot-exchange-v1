import { ethers } from 'ethers'
import useMounted from 'hooks/useMounted'
import Link from 'next/link'
import { FC } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { useEnsName } from 'wagmi'
import useWinners from 'hooks/useWinners'
import { GetWinnerDataResponseItem } from 'lib/getWinners'
import { jsNumberForAddress } from 'react-jazzicon'
import Jazzicon from 'react-jazzicon/dist/Jazzicon'

interface WinnerItemRowProps {
  item: GetWinnerDataResponseItem
  index: number
}

const PastWinners: FC = () => {
  const { data: recentWinners } = useWinners()
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  // For manually adding claim tx_Hash, remove when fixed
  const txHash = [
    {
      pot_id: 3,
      ticket_id: 1391,
      tx_hash:
        '0x9979d8057f26dc50829b159ee70fd9f0980ae27bdeff4140be302e9d3c2955eb',
    },
  ]

  const updateTxHash = (item: GetWinnerDataResponseItem) => {
    for (const customItem of txHash) {
      if (
        item.pot_id === customItem.pot_id &&
        item.ticket_id === customItem.ticket_id
      ) {
        return { ...item, tx_hash: customItem.tx_hash }
      }
    }
    return item
  }

  const updatedWinners =
    recentWinners &&
    recentWinners.map((item, index) => {
      return updateTxHash(item)
    })

  return (
    <div>
      <div className="no-scrollbar max-h-[602px] w-full overflow-x-hidden rounded-lg border px-2 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 md:px-4">
        <table className="w-full mb-0">
          <thead className="sticky top-0 z-10 bg-white border-b ring-b border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
            <tr className="md:text-medium text-xs text-[#747474] dark:text-neutral-300 md:text-sm">
              <th className="py-4 text-left font-medium text-[#747474]  dark:text-neutral-300  md:p-4">
                Name
              </th>

              <th className="py-4 text-left font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Prize
              </th>
              <th className="py-4 text-center font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Winning #
              </th>
              <th className="hidden py-2 font-medium text-center md:block md:p-4">
                Date
              </th>
              <th className="py-4 text-center font-medium text-[#747474] dark:text-neutral-300 md:p-4">
                Etherscan
              </th>
              <th className="hidden py-4 text-center font-medium  text-[#747474] dark:text-neutral-300 md:block md:p-4">
                VRF
              </th>
            </tr>
          </thead>
          <tbody>
            {updatedWinners && updatedWinners.length > 2 ? (
              updatedWinners
                .filter((item) => item.pot_id !== 1 && item.pot_id !== 2)
                .map((item, index) => (
                  <WinnerItemRow key={index} item={item} index={index} />
                ))
            ) : (
              <tr className="mx-1 my-4 md:mx-0">
                <td className="p-4 text-sm bg-white rounded-xl dark:border-0 dark:bg-neutral-900">
                  No winners to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PastWinners
const WinnerItemRow: FC<WinnerItemRowProps> = ({ item }) => {
  const address = ethers.utils.getAddress(item.wallet_address)
  const { data: ensName } = useEnsName({ address: address })
  const formattedPrize = ethers.utils.formatEther(
    item?.pot_size?.toString() || '0'
  )
  const time = new Date(item.raffle_timestamp!).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const shortTxn = item.tx_hash.slice(0, 4) + '...' + item.tx_hash.slice(-4)

  return (
    <tr
      key={item.pot_id}
      className="m-2 text-sm text-center border-b dark:border-0"
    >
      <td className="px-2 py-4 text-left md:w-1/3 md:px-4 ">
        <Link href={`/address/${item.wallet_address}`} legacyBehavior={true}>
          <a className="flex flex-row items-center transition rounded outline-none cursor-pointer justify-left hover:text-purple-700 focus:text-purple-700 dark:hover:text-purple-500">
            <Jazzicon
              diameter={20}
              seed={jsNumberForAddress(item.wallet_address || '')}
            />{' '}
            {ensName ? (
              <div className="p-2 font-medium text-left ">{ensName}</div>
            ) : (
              <>
                <div className="hidden w-1/3 p-2 font-medium text-left md:flex">
                  {`${item.wallet_address.slice(
                    0,
                    7
                  )}...${item.wallet_address.slice(-7)}`}
                </div>

                <div className="w-1/3 p-2 font-medium text-left md:hidden">
                  {`${item.wallet_address.slice(
                    0,
                    5
                  )}...${item.wallet_address.slice(-5)}`}
                </div>
              </>
            )}
          </a>
        </Link>
      </td>
      <td className="p-2 text-center ">
        <div className="flex flex-row items-center gap-2 justify-left">
          <img src="/eth-logo.svg" className="w-3 h-3 md:h-4 md:w-4" />
          <span>{formattedPrize}</span>
        </div>
      </td>

      <td className="p-2 text-center text-[#0FA46E]">{item.ticket_id}</td>
      <td className="hidden p-2 text-center md:table-cell">{time}</td>
      <td className="p-2 text-center">
        {' '}
        {item.tx_hash && item.tx_hash !== '' && (
          <a
            href={`https://etherscan.io/tx/${item.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center font-medium hover:text-purple-700 focus:text-purple-700 dark:hover:text-purple-500"
          >
            <span className="text-xs text-neutral-500">View</span>{' '}
            <FiExternalLink className="ml-2" />
          </a>
        )}
      </td>
      <td className="hidden p-2 text-center md:table-cell ">
        {' '}
        {item.vrf_tx_hash && item.vrf_tx_hash !== '' && (
          <a
            href={`https://etherscan.io/tx/${item.vrf_tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center font-medium hover:text-purple-700 focus:text-purple-700 dark:hover:text-purple-500"
          >
            <span className="text-xs text-neutral-500">View</span>{' '}
            <FiExternalLink className="ml-2" />
          </a>
        )}
      </td>
    </tr>
  )
}
