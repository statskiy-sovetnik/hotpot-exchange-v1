import usePaginatedCollections from 'hooks/usePaginatedCollections'
import { PercentageChange } from './hero/HeroStats'
import { paths } from '@reservoir0x/reservoir-sdk'
import { optimizeImage } from 'lib/optmizeImage'
import { RiBarChart2Line } from 'react-icons/ri'
import { useMediaQuery } from '@react-hookz/web'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { FC } from 'react'

import SortTrendingCollections from './SortTrendingCollections'
import FormatNativeCrypto from 'components/FormatNativeCrypto'

type Props = {
  fallback: {
    collections: paths['/collections/v5']['get']['responses']['200']['schema']
  }
}

type Volumes = '1DayVolume' | '7DayVolume' | '30DayVolume'

const TrendingCollectionTable: FC<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)

  const { collections, ref } = usePaginatedCollections(
    router,
    fallback.collections
  )

  const shouldInfiniteLoad = false

  const { data } = collections
  const mappedCollections = data
    ? data.flatMap(({ collections }) => collections)
    : []

  const sort = router?.query['sort']?.toString()

  const columns = isSmallDevice
    ? ['Collection', 'Floor Price']
    : ['Collection', 'Floor Price', 'Change', 'Volume', 'Owners']

  return (
    <>
      <div className="flex w-full items-center justify-between ">
        <div className="flex flex-row items-center gap-2 py-6">
          <RiBarChart2Line className="h-5 w-5" />
          <h2 className="reservoir-h1 text-xl text-[#620DED] dark:text-violet-500 md:text-2xl">
            Trending Collections
          </h2>
        </div>
        {!isSmallDevice && <SortTrendingCollections />}
      </div>
      <div className="no-scrollbar max-h-[600px] w-full overflow-x-auto overflow-y-hidden rounded-lg border dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 ">
        <table className="mb-2 w-full table-auto">
          <thead className="z-9 sticky top-0 bg-white ring-1 ring-neutral-100 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 ">
            <tr>
              {columns.map((item) => (
                <th
                  key={item}
                  scope="col"
                  className="px-4 py-4 text-left text-sm text-sm font-medium text-[#747474] dark:text-neutral-300"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedCollections?.slice(0, 8).map((collection, index) => {
              const {
                tokenHref,
                image,
                name,
                days1,
                days30,
                days7,
                days1Change,
                days7Change,
                days30Change,
                floorSaleChange1Days,
                floorSaleChange7Days,
                floorSaleChange30Days,
                floorPrice,
                supply,
                ownerCount,
              } = processCollection(collection)

              return (
                <tr
                  key={index}
                  className={`group border-neutral-300 text-sm dark:border-neutral-600 dark:text-white`}
                >
                  {/* COLLECTION */}
                  <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-4 py-3 dark:text-white">
                    <Link href={tokenHref} legacyBehavior={true}>
                      <a className="flex items-center gap-4">
                        <img
                          src={optimizeImage(image, 140)}
                          className="h-[36px] w-[36px] rounded-xl object-cover"
                        />
                        <div
                          className={`overflow-hidden truncate whitespace-nowrap dark:text-white ${
                            isSmallDevice ? 'max-w-[140px]' : 'max-w-[200px]'
                          }`}
                        >
                          <p className="truncate text-left text-sm font-medium dark:text-white">
                            {name}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </td>

                  {/* FLOOR PRICE */}
                  <td className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium dark:text-white md:px-8">
                    <FormatNativeCrypto amount={floorPrice} />
                  </td>

                  {/* 1D CHANGE */}
                  {!isSmallDevice && (
                    <td className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium dark:text-white">
                      <PercentageChange
                        value={
                          sort === '7DayVolume'
                            ? floorSaleChange7Days
                            : sort === '30DayVolume'
                            ? floorSaleChange30Days
                            : floorSaleChange1Days
                        }
                      />
                    </td>
                  )}

                  {/* 1D VOLUME */}
                  {!isSmallDevice && (
                    <td className="reservoir-body whitespace-nowrap px-4 py-3 text-left text-sm font-medium dark:text-white">
                      <FormatNativeCrypto
                        amount={
                          sort === '7DayVolume'
                            ? days7
                            : sort === '30DayVolume'
                            ? days30
                            : days1
                        }
                      />
                    </td>
                  )}

                  {/* OWNERS */}
                  {!isSmallDevice && (
                    <td className="reservoir-body whitespace-nowrap px-4 py-2 text-left dark:text-white">
                      <span className="flex-grow whitespace-nowrap text-sm font-medium">
                        {ownerCount}
                      </span>
                    </td>
                  )}
                  {/* 
                  SUPPLY
                  {!isSmallDevice && (
                    <td className="px-4 py-2 text-left reservoir-body whitespace-nowrap dark:text-white">
                      <span className="flex-grow text-sm font-medium whitespace-nowrap">
                        {supply}
                      </span>
                    </td>
                  )} */}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TrendingCollectionTable

function processCollection(
  collection:
    | NonNullable<
        NonNullable<Props['fallback']['collections']>['collections']
      >[0]
    | undefined
) {
  const data = {
    contract: collection?.primaryContract,
    id: collection?.id,
    image: collection?.image,
    name: collection?.name,
    days1: collection?.volume?.['1day'],
    days7: collection?.volume?.['7day'],
    days30: collection?.volume?.['30day'],
    days1Change: collection?.volumeChange?.['1day'],
    days7Change: collection?.volumeChange?.['7day'],
    days30Change: collection?.volumeChange?.['30day'],
    floor1Days: collection?.floorSale?.['1day'],
    floor7Days: collection?.floorSale?.['7day'],
    floor30Days: collection?.floorSale?.['30day'],
    floorSaleChange1Days: collection?.floorSaleChange?.['1day'],
    floorSaleChange7Days: collection?.floorSaleChange?.['7day'],
    floorSaleChange30Days: collection?.floorSaleChange?.['30day'],
    floorPrice: collection?.floorAsk?.price?.amount?.native,
    supply: collection?.tokenCount,
    ownerCount: collection?.ownerCount,
  }

  const tokenHref = `/collections/${data.id}`

  return { ...data, tokenHref }
}
