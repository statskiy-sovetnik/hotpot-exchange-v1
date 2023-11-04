import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { ComponentProps } from 'react'
import Layout from 'components/Layout'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

import ActivitiesTicker from 'components/ActivitiesTicker'
import RewardsTab from 'components/RewardsTab'
import Header from 'components/rewards/Header'
import useMounted from 'hooks/useMounted'
import Footer from 'components/Footer'
import Navbar from 'components/Navbar'
import Toast from 'components/Toast'
import Join from 'components/Join'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Rewards: NextPage<Props> = () => {
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
      <div className="col-span-full mt-4 mb-12 px-2 md:mt-5 lg:px-12">
        <Header />
        <ActivitiesTicker />
        <RewardsTab />
        <Join />
        {account.isConnected ? <></> : <div className=""></div>}
      </div>
      <Footer />
    </Layout>
  )
}

export default Rewards

export const getStaticProps: GetStaticProps<{}> = async () => {
  return {
    props: {},
  }
}
