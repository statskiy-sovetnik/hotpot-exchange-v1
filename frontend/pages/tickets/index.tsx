import Layout from 'components/Layout'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useAccount } from 'wagmi'
import Toast from 'components/Toast'
import toast from 'react-hot-toast'
import { ComponentProps } from 'react'
import useMounted from 'hooks/useMounted'
import Footer from 'components/Footer'
import Navbar from 'components/Navbar'
import Link from 'next/link'
import MyTicketsGrid from 'components/MyTicketsGrid'
import ConnectWalletCard from 'components/ConnectWalletCard'
import ButtonGradient from 'components/ButtonGradient'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Tickets: NextPage<Props> = () => {
  const account = useAccount()
  const isMounted = useMounted()

  if (!isMounted) {
    return null
  }

  const setToast: (data: ComponentProps<typeof Toast>['data']) => any = (
    data
  ) => toast.custom((t) => <Toast t={t} toast={toast} data={data} />)

  return (
    <Layout navbar={{}}>
      <Navbar />
      <div className="px-2 mt-4 mb-12 col-span-full md:mt-5 lg:px-12">
        {account.isConnected ? (
          <MyTicketsGrid />
        ) : (
          <>
            <div className="flex flex-row items-center justify-between md:mt-7">
              <div className="text-xl font-medium reservoir-h1 md:text-3xl">
                My Tickets
              </div>
              <Link href="/rewards" legacyBehavior={true}>
                <ButtonGradient>View Rewards</ButtonGradient>
              </Link>
            </div>
            <ConnectWalletCard />
          </>
        )}
      </div>
      <Footer />
    </Layout>
  )
}

export default Tickets

export const getStaticProps: GetStaticProps<{}> = async () => {
  return {
    props: {},
  }
}
