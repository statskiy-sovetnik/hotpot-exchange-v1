import * as Dialog from '@radix-ui/react-dialog'
import ConnectWalletButton from 'components/ConnectWalletButton'
import NavbarLogo from 'components/navbar/NavbarLogo'
import Link from 'next/link'
import { FC, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { HiOutlineLogout, HiX } from 'react-icons/hi'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'
import { Balance, BalanceUsd } from './ConnectWallet'
import ThemeSwitcher from './ThemeSwitcher'
import { RiArrowRightLine } from 'react-icons/ri'
import Avatar from './Avatar'
import { TbTicket } from 'react-icons/tb'
import { truncateAddress, truncateEns } from 'lib/truncateText'
import CopyClipboard from './CopyClipboard'

const HamburgerMenu: FC = () => {
  const [open, setOpen] = useState(false)
  const { connectors } = useConnect()
  const accountData = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName()
  const { data: ensAvatar } = useEnsAvatar()
  const wallet = connectors[0]

  return (
    <Dialog.Root onOpenChange={setOpen} open={open} modal={false}>
      <Dialog.Trigger className="z-5 block p-1.5 md:hidden">
        <FiMenu className="w-6 h-6" />
      </Dialog.Trigger>

      <Dialog.Content
        className="fixed inset-0 z-20 transform bg-white dark:bg-black"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 dark:border-neutral-600">
          <NavbarLogo variant="desktop" />
          <Dialog.Close className="btn-primary-outline py-1.5 px-[5px] dark:text-white">
            <HiX className="w-6 h-6" />
          </Dialog.Close>
        </div>

        <div className="w-full px-6 py-4 space-y-4 bg-white radix-side-bottom:animate-slide-down dark:bg-black dark:text-gray-300">
          <Link href={`/how-it-works`} legacyBehavior={true}>
            <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              <div className="flex flex-row items-center justify-center gap-2">
                <h6 className="text-base font-medium reservoir-h1">
                  How it Works
                </h6>
              </div>
              <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
            </a>
          </Link>
          <Link href={`/rewards`} legacyBehavior={true}>
            <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
              <div className="flex flex-row items-center justify-center gap-2">
                <h6 className="text-base font-medium reservoir-h1">Rewards</h6>
              </div>
              <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
            </a>
          </Link>
          {accountData.isConnected && (
            <>
              <Link
                href={`/address/${accountData.address}`}
                legacyBehavior={true}
              >
                <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <Avatar
                      address={accountData.address}
                      avatar={ensAvatar}
                      size={24}
                    />
                    <h6 className="text-base font-medium reservoir-h1">
                      My Profile
                    </h6>
                  </div>
                  <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
                </a>
              </Link>
              <Link href={`/tickets`} legacyBehavior={true}>
                <a className="flex items-center justify-between w-full p-3 transition rounded-lg outline-none cursor-pointer group hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <TbTicket className="w-6 h-6" />
                    <h6 className="text-base font-medium reservoir-h1">
                      My Tickets
                    </h6>
                  </div>
                  <RiArrowRightLine className="h-6 w-6 text-[#909090] dark:text-neutral-300" />
                </a>
              </Link>
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
                      {truncateAddress(accountData.address || '')}
                    </div>

                    <CopyClipboard content={accountData.address as string} />
                  </div>
                )}

                <div className="flex flex-row items-center justify-between w-full text-gray-800 dark:text-neutral-200">
                  <div className="flex flex-row items-center justify-center text-sm font-medium">
                    {accountData.address && (
                      <Balance address={accountData.address} />
                    )}
                  </div>

                  <h6 className="text-sm">
                    {accountData.address && (
                      <BalanceUsd address={accountData.address} />
                    )}
                  </h6>
                </div>
              </div>
            </>
          )}
          <ThemeSwitcher />
          {accountData.isConnected ? (
            <button
              key={wallet.id}
              onClick={() => disconnect()}
              className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded   p-4 text-[#4B5563] outline-none transition  focus:bg-neutral-100 dark:border-neutral-800 dark:text-white "
            >
              <span>Disconnect</span>
              <HiOutlineLogout className="h-6 w-7" />
            </button>
          ) : (
            <div className="flex items-center justify-center w-full">
              <ConnectWalletButton className="w-full ">
                <span>Connect Wallet</span>
              </ConnectWalletButton>
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default HamburgerMenu
