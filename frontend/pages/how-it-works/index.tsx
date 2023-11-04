import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import useMounted from 'hooks/useMounted'
import { ComponentProps } from 'react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

import LearnMore from 'components/LearnMore'
import Footer from 'components/Footer'
import Navbar from 'components/Navbar'
import Header from 'components/Header'
import Layout from 'components/Layout'
import Toast from 'components/Toast'
import Faq from 'components/Faq'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const HowItWorks: NextPage<Props> = () => {
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
        <LearnMore />
        {account.isConnected ? <></> : <div className=""></div>}
        <Faq />
      </div>
      <Footer />
    </Layout>
  )
}

export default HowItWorks

export const getStaticProps: GetStaticProps<{}> = async () => {
  return {
    props: {},
  }
}
