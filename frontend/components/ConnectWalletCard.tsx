import { FC } from 'react'
import { RiWalletLine } from 'react-icons/ri'
import ConnectWalletButtonSecondary from './ConnectWalletButtonSecondary'

const ConnectWalletCard: FC = () => {
  return (
    <div className="mt-6 flex h-[480px] w-full items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
      <div className="flex flex-col items-center justify-center gap-4">
        <RiWalletLine className="w-10 h-10" />

        <div className="text-2xl font-medium reservoir-h1">Connect Wallet</div>
        <div className="reservoir-h1 w-[280px] text-center text-sm font-normal text-neutral-500">
          Looks like you have not yet connected your wallet
        </div>
        <ConnectWalletButtonSecondary>
          <div> Connect Wallet</div>
        </ConnectWalletButtonSecondary>
      </div>
    </div>
  )
}

export default ConnectWalletCard
