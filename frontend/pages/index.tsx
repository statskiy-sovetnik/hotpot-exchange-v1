import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { GetCollectionsResponse } from 'types/reservoir'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useMediaQuery } from '@react-hookz/web'
import { RiMedalLine } from 'react-icons/ri'
import { useRouter } from 'next/router'
import setParams from 'lib/params'
import { useEffect } from 'react'
import Head from 'next/head'

import LeaderboardTicketHolder from 'components/LeaderboardTicketHolder'
import TrendingCollectionTable from 'components/TrendingCollectionTable'
import RecentHotpotListing from 'components/RecentHotpotListing'
import HeaderHome from 'components/HeaderHome'
import ActivitiesTicker from 'components/ActivitiesTicker'
import Footer from 'components/Footer'
import Layout from 'components/Layout'
import Navbar from 'components/Navbar'

// Environment variables
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

// OPTIONAL
const RESERVOIR_API_KEY = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY
const REDIRECT_HOMEPAGE = process.env.NEXT_PUBLIC_REDIRECT_HOMEPAGE
const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE
const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION
const META_IMAGE = process.env.NEXT_PUBLIC_META_OG_IMAGE
const TAGLINE = process.env.NEXT_PUBLIC_TAGLINE
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID

type Props = InferGetStaticPropsType<typeof getStaticProps>

const metadata = {
  title: (title: string) => <title>{title}</title>,
  description: (description: string) => (
    <meta name="description" content={description} />
  ),
  tagline: (tagline: string | undefined) => (
    <>{tagline || 'Discover, buy and sell NFTs'}</>
  ),
  image: (image?: string) => {
    if (image) {
      return (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="og:image" content={image} />
        </>
      )
    }
    return null
  },
}

const Home: NextPage<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  const title = META_TITLE && metadata.title(META_TITLE)
  const description = META_DESCRIPTION && metadata.description(META_DESCRIPTION)
  const image = metadata.image(META_IMAGE)
  const tagline = metadata.tagline(TAGLINE)

  useEffect(() => {
    if (REDIRECT_HOMEPAGE && COLLECTION) {
      router.push(`/collections/${COLLECTION}`)
    }
  }, [COLLECTION, REDIRECT_HOMEPAGE])

  // Return error page if the API base url or the environment's
  // chain ID are missing
  if (!CHAIN_ID) {
    console.debug({ CHAIN_ID })
    return <div>There was an error</div>
  }

  if (REDIRECT_HOMEPAGE && COLLECTION) return null

  return (
    <Layout navbar={{}}>
      <Head>
        {title}
        {description}
        {image}
      </Head>
      <Navbar />
      <div className='col-span-full h-auto bg-[url("/bg-homepage.svg")] bg-cover bg-left bg-no-repeat md:h-[60vh] md:bg-center lg:h-[80vh] xl:h-[100vh]'>
        <HeaderHome />
      </div>
      <div className="col-span-full">
        <ActivitiesTicker />
      </div>

      <div className="col-span-full px-2 md:px-16">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full rounded-2xl md:w-3/5">
            <TrendingCollectionTable fallback={fallback} />
          </div>
          <div className="w-full grow rounded-2xl md:w-2/5">
            <div className="flex flex-row items-center gap-2 py-6">
              <RiMedalLine className="h-5 w-5" />
              <h2 className="reservoir-h1 text-xl text-[#620DED] dark:text-violet-500 md:text-2xl">
                Leaderboard
              </h2>
            </div>
            <div className="rounded-lg border dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600">
              <LeaderboardTicketHolder />
            </div>
          </div>
        </div>
      </div>
      <div
        id="hotpot-listings"
        className="col-span-full mt-[60px] px-2 md:px-16"
      >
        <RecentHotpotListing />
      </div>

      <Footer />
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps<{
  fallback: {
    collections: GetCollectionsResponse
  }
}> = async () => {
  const options: RequestInit | undefined = {}

  if (RESERVOIR_API_KEY) {
    options.headers = {
      'x-api-key': RESERVOIR_API_KEY,
    }
  }

  const url = new URL('/collections/v5', RESERVOIR_API_BASE)

  let query: paths['/collections/v5']['get']['parameters']['query'] = {
    limit: 9,
    sortBy: '1DayVolume',
    normalizeRoyalties: true,
  }

  if (COLLECTION && !COMMUNITY) query.contract = [COLLECTION]
  if (COMMUNITY) query.community = COMMUNITY
  if (COLLECTION_SET_ID) query.collectionsSetId = COLLECTION_SET_ID

  const href = setParams(url, query)
  const res = await fetch(href, options)

  const collections = (await res.json()) as Props['fallback']['collections']

  return {
    props: {
      fallback: {
        collections,
      },
    },
  }
}
