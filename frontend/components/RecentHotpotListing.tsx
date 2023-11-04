import { useState, useEffect } from 'react'
import { FC } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useRecentHotpotData from 'hooks/useRecentHotpotData'
import TokenCardRecent from './TokenCardRecent'
import Masonry from 'react-masonry-css'
import LoadingCardRecent from './LoadingCardRecent'
import { FaChevronCircleDown } from 'react-icons/fa'
import { CgSpinner } from 'react-icons/cg'

const PAGE_SIZE = 20

const RecentHotpotListing: FC = () => {
  const { data, mutate, size, setSize, isValidating } = useRecentHotpotData()

  const items = data ? [].concat(...data) : []
  const isLoadingMore =
    size > 0 && data && typeof data[size - 1] === 'undefined'
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length <= PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  return (
    <>
      <div>
        <h1 className="reservoir-h1 text-xl font-extrabold not-italic text-[#620DED] dark:text-violet-500 md:text-2xl">
          Recent Hotpot Listings
        </h1>
      </div>

      <Masonry
        key="collectionGridMasonry"
        breakpointCols={{
          default: 5,
          1536: 5,
          1280: 5,
          1024: 3,
          768: 2,
          640: 2,
          500: 1,
        }}
        className="mt-6 masonry-grid col-span-full md:mt-8"
        columnClassName="masonry-grid_column"
      >
        {items &&
          Array.isArray(items) &&
          items.map((token, index) => (
            <div key={index} className="px-4 py-2 md:px-0">
              <TokenCardRecent hotpotListing={token} />
            </div>
          ))}
      </Masonry>
      {items.length > 0 && !isReachingEnd && (
        <div className="flex items-center justify-center w-full">
          <button
            disabled={isLoadingMore || isReachingEnd}
            onClick={() => setSize(size + 1)}
            className="mt-1 flex cursor-pointer flex-row items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium text-[#845CFF] transition-transform hover:scale-105 dark:text-neutral-400"
          >
            {isLoadingMore ? (
              <>
                <CgSpinner className="w-5 h-5 animate-spin" />
              </>
            ) : isReachingEnd ? (
              'no more items'
            ) : (
              <>
                load more <FaChevronCircleDown />
              </>
            )}
          </button>
        </div>
      )}
    </>
  )
}

export default RecentHotpotListing
