import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC, ReactElement } from 'react'
import { WagmiConfig, useAccount } from 'wagmi'

type Props = {
  className?: HTMLButtonElement['className']
  children: ReactElement
}

const ConnectWalletButtonSecondary: FC<Props> = ({ className, children }) => {
  const account = useAccount()

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'

        return (
          <div
            {...((!ready || account.isConnected) && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
                display: 'none',
              },
            })}
          >
            {(() => {
              return (
                <button
                  onClick={openConnectModal}
                  type="button"
                  className={`font-base group reservoir-h1 relative  mr-2 inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-gray-900 hover:from-[#620DED] hover:to-[#620DED] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800 ${className}`}
                >
                  <span className=" relative rounded-[7px] bg-white px-12 py-2  group-hover:bg-opacity-0 group-hover:text-white dark:bg-gray-900">
                    {children}
                  </span>
                </button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default ConnectWalletButtonSecondary
