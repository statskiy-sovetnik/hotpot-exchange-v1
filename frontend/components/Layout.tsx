import { ComponentProps, FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import NetworkWarning from './NetworkWarning'
import PotResultTicker from './PotResultTicker'
import Confetti from './Confetti'

type Props = {
  navbar: ComponentProps<typeof Navbar>
  children: ReactNode
}

const Layout: FC<Props> = ({ children, navbar }) => {
  return (
    <>
      <Toaster
        position={'bottom-right'}
        containerStyle={{ zIndex: 100000000000, marginTop: 86 }}
      />
      <Confetti />
      <NetworkWarning />
      <PotResultTicker />
      <main className="mx-auto grid max-w-[2560px] grid-cols-4 gap-x-4 overflow-hidden pb-2 md:grid-cols-8 lg:grid-cols-12 3xl:grid-cols-16 4xl:grid-cols-21">
        {children}
      </main>
    </>
  )
}

export default Layout
