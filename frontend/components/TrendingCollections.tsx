import { useMediaQuery } from '@react-hookz/web'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import FormatNativeCrypto from 'components/FormatNativeCrypto'
import { formatNumber } from 'lib/numbers'
import { optimizeImage } from 'lib/optmizeImage'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Collection } from 'types/reservoir'
import { PercentageChange } from './hero/HeroStats'

const TrendingCollections = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  const sort = router?.query['sort']?.toString() || '1DayVolume'
  const { data: trendingCollections } = useCollections({
    limit: 9,
    sortBy: sort as '1DayVolume' | '7DayVolume' | '30DayVolume',
  })

  const columns = isSmallDevice
    ? ['Collection', 'Floor Price']
    : ['Collection', 'Floor Price', 'Change', 'Volume', 'Owners']

  return (
    <>
      <div className="no-scrollbar w-full overflow-x-auto overflow-y-auto rounded-lg border dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600 ">
        <table className="mb-2 w-full table-auto">
          <thead className="z-9 sticky top-0 border-b border-[#FFF5F5] dark:border-0 dark:ring-1 dark:ring-neutral-600 ">
            <tr>
              {columns.map((item) => (
                <th
                  key={item}
                  scope="col"
                  className="reservoir-subtitle px-4 py-4 text-left text-sm dark:text-white"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trendingCollections?.map((collection) => {
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
                  key={collection.id}
                  className={`group border-neutral-300 text-sm dark:border-neutral-600 dark:text-white`}
                >
                  {/* COLLECTION */}
                  <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-3 dark:text-white">
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
                          <p className="text-light reservoir-subtitle truncate text-left text-sm dark:text-white">
                            {name}
                          </p>
                        </div>
                      </a>
                    </Link>
                  </td>

                  {/* FLOOR PRICE */}
                  <td className="reservoir-body whitespace-nowrap px-6 py-3 text-left text-sm font-semibold dark:text-white">
                    <FormatNativeCrypto amount={floorPrice} />
                  </td>

                  {/* 1D CHANGE */}
                  {!isSmallDevice && (
                    <td className="reservoir-body whitespace-nowrap px-6 py-3 text-left text-sm dark:text-white">
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
                    <td className="reservoir-body whitespace-nowrap px-6 py-3 text-left text-sm font-semibold dark:text-white">
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
                    <td className="reservoir-body whitespace-nowrap px-6 py-2 text-left dark:text-white">
                      <span className="flex-grow whitespace-nowrap text-sm font-semibold">
                        {ownerCount}
                      </span>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TrendingCollections

function processCollection(collection: Collection) {
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
