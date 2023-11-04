import { FC } from 'react'
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  Address,
} from 'wagmi'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { HiOutlineLogout } from 'react-icons/hi'
import { truncateAddress, truncateEns } from 'lib/truncateText'
import Link from 'next/link'
import FormatNativeCrypto from './FormatNativeCrypto'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CopyClipboard from './CopyClipboard'
import useMounted from 'hooks/useMounted'
import Avatar from './Avatar'
import ThemeSwitcher from './ThemeSwitcher'
import { RiArrowRightLine } from 'react-icons/ri'
import { TbTicket } from 'react-icons/tb'
import useCoinConversion from 'hooks/useCoinConversion'
import { formatDollar } from 'lib/numbers'

const ConnectWallet: FC = () => {
  const account = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address: account?.address })
  const { data: ensName } = useEnsName({ address: account?.address })

  const { connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const wallet = connectors[0]
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  if (!account.isConnected)
    return (
      <ConnectWalletButton>
        <div className="text-base font-bold text-white reservoir-h1">
          Connect
        </div>
      </ConnectWalletButton>
    )

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="p-0 ml-auto normal-case border-transparent rounded-full btn-primary-outline dark:border-neutral-600 dark:bg-neutral-900 dark:ring-primary-900 dark:focus:ring-4">
        <Avatar address={account.address} avatar={ensAvatar} size={40} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={12}>
        <div className=" w-[280px] space-y-3 rounded-xl bg-white px-4 py-4 shadow-lg radix-side-bottom:animate-slide-down dark:bg-neutral-900 dark:text-gray-300">
          <Link href={`/address/${account.address}`} legacyBehavior={true}>
            <DropdownMenu.Item asChild>
              <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <div className="flex flex-row items-center justify-center gap-2">
                  <Avatar
                    address={account.address}
                    avatar={ensAvatar}
                    size={24}
                  />
                  <h6 className="text-base font-medium reservoir-h1">
                    My Profile
                  </h6>
                </div>
                <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
              </a>
            </DropdownMenu.Item>
          </Link>

          <Link href={`/tickets`} legacyBehavior={true}>
            <DropdownMenu.Item asChild>
              <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                <div className="flex flex-row items-center justify-center gap-2">
                  <TbTicket className="w-6 h-6" />
                  <h6 className="text-base font-medium reservoir-h1">
                    My Tickets
                  </h6>
                </div>
                <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
              </a>
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Item asChild>
            <div className="group flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-xl bg-[#F6F6F6] p-3 outline-none transition  dark:bg-neutral-800 dark:text-white">
              {ensName ? (
                <div className="flex flex-row items-center justify-between w-full text-gray-800 dark:text-neutral-300">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <img src="/metamask-icon.svg" className="w-6 h-6" />
                    <span className="text-sm font-medium text-gray-800 dark:text-neutral-200">
                      {truncateEns(ensName)}
                    </span>
                  </div>
                  <CopyClipboard content={ensName as string} />
                </div>
              ) : (
                <div className="flex flex-row items-center justify-between w-full text-gray-800 dark:text-neutral-200">
                  <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium">
                    <img src="/metamask-icon.svg" className="w-6 h-6" />
                    {truncateAddress(account.address || '')}
                  </div>

                  <CopyClipboard content={account.address as string} />
                </div>
              )}

              <div className="flex flex-row items-center justify-between w-full text-gray-800 dark:text-neutral-200">
                <div className="flex flex-row items-center justify-center text-sm font-medium">
                  {account.address && <Balance address={account.address} />}
                </div>

                <h6 className="text-sm">
                  {account.address && <BalanceUsd address={account.address} />}
                </h6>
              </div>
            </div>
          </DropdownMenu.Item>

          <ThemeSwitcher />
          <DropdownMenu.Item asChild>
            <button
              key={wallet.id}
              onClick={() => {
                disconnect()
              }}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg p-3 text-[#FF3636] outline-none transition hover:bg-neutral-100 focus:bg-neutral-100 dark:text-red-600 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <span>Disconnect</span>
              <HiOutlineLogout className="w-6 h-6" />
            </button>
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ConnectWallet

type Props = {
  address: string
}

export const Balance: FC<Props> = ({ address }) => {
  const { data: balance } = useBalance({ address: address as Address })
  return <FormatNativeCrypto amount={balance?.value} logoWidth={24} />
}

export const BalanceUsd: FC<Props> = ({ address }) => {
  const { data: balance } = useBalance({ address: address as Address })
  const balanceUsdConversion = useCoinConversion('usd', 'eth')

  const balanceUsd =
    balance && balanceUsdConversion
      ? balanceUsdConversion * parseFloat(balance.formatted)
      : null

  const formattedBalance = formatDollar(balanceUsd)
  return <div>{formattedBalance}</div>
}
