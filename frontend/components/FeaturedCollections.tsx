import { FC } from 'react'
import Slider from 'react-slick'
import FeaturedCollection from 'components/FeaturedCollection'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link'
import LoadingCardFeatured from './LoadingCardFeatured'

type Props = {
  settings: Object
}

const FeaturedCollections: FC<Props> = ({ settings }) => {
  const { data: trendingCollections } = useCollections({
    limit: 8,
    sortBy: '1DayVolume',
  })
  const placeholder = '/nft_placeholder.png'
  return (
    <>
      <div>
        <h1 className="reservoir-h1 text-xl font-extrabold not-italic text-[#9659F9]	md:text-2xl ">
          FEATURED COLLECTIONS
        </h1>
      </div>
      <div className="mt-6 md:mt-8">
        <Slider {...settings}>
          {trendingCollections
            ? trendingCollections.map((trendingCollection) => (
                <Link
                  key={trendingCollection.id}
                  href={`/collections/${trendingCollection.id}`}
                  legacyBehavior={true}
                >
                  <a
                    href={`/collections/${trendingCollection.id}`}
                    className="m-2 mx-4 mb-6 grid max-h-[200px] max-w-[320px] transform-gpu grid-cols-1 self-start overflow-hidden rounded-[16px] ring-1 ring-neutral-200 transition ease-in hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:ease-out dark:border-0 dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600 md:mx-2"
                  >
                    <FeaturedCollection
                      name={trendingCollection?.name}
                      avatar={trendingCollection?.image || placeholder}
                    />
                  </a>
                </Link>
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <div key={`loading-card-${index}`} className="p-2">
                  <LoadingCardFeatured />
                </div>
              ))}
        </Slider>
      </div>
    </>
  )
}

export default FeaturedCollections
