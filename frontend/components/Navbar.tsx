import { FC, ReactElement, useEffect, useState } from 'react'
import ConnectWallet from './ConnectWallet'
import HamburgerMenu from './HamburgerMenu'
import dynamic from 'next/dynamic'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useMediaQuery } from '@react-hookz/web'
import setParams from 'lib/params'
import NavbarLogo from 'components/navbar/NavbarLogo'
import CartMenu from './CartMenu'
import SearchMenu from './SearchMenu'
import useMounted from 'hooks/useMounted'
import TicketCount from './TicketCount'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { TbSquareRoundedPlusFilled } from 'react-icons/tb'

const SearchCollections = dynamic(() => import('./SearchCollections'))
const CommunityDropdown = dynamic(() => import('./CommunityDropdown'))
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
const DEFAULT_TO_SEARCH = process.env.NEXT_PUBLIC_DEFAULT_TO_SEARCH

function getInitialSearchHref() {
  const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE
  const pathname = `${PROXY_API_BASE}/search/collections/v1`
  const query: paths['/search/collections/v1']['get']['parameters']['query'] =
    {}

  if (COLLECTION_SET_ID) {
    query.collectionsSetId = COLLECTION_SET_ID
  } else {
    if (COMMUNITY) query.community = COMMUNITY
  }

  return setParams(pathname, query)
}

const Navbar: FC = () => {
  const isMounted = useMounted()
  const { isConnected } = useAccount()
  const account = useAccount()
  const [filterComponent, setFilterComponent] = useState<ReactElement | null>(
    null
  )
  const isMobile = useMediaQuery('(max-width: 770px)')
  const showDesktopSearch = useMediaQuery('(min-width: 1200px)')
  const [hasCommunityDropdown, setHasCommunityDropdown] =
    useState<boolean>(false)

  const isGlobal = !COMMUNITY && !COLLECTION && !COLLECTION_SET_ID
  const filterableCollection = isGlobal || COMMUNITY || COLLECTION_SET_ID

  useEffect(() => {
    if (filterableCollection) {
      const href = getInitialSearchHref()

      fetch(href).then(async (res) => {
        let initialResults = undefined

        if (res.ok) {
          initialResults =
            (await res.json()) as paths['/search/collections/v1']['get']['responses']['200']['schema']
        }

        const smallCommunity =
          initialResults?.collections &&
          initialResults.collections.length >= 2 &&
          initialResults.collections.length <= 10

        const hasCommunityDropdown =
          !DEFAULT_TO_SEARCH &&
          (COMMUNITY || COLLECTION_SET_ID) &&
          smallCommunity

        if (hasCommunityDropdown) {
          setFilterComponent(
            <CommunityDropdown
              collections={initialResults?.collections}
              defaultCollectionId={COLLECTION}
            />
          )
          setHasCommunityDropdown(true)
        } else {
          setHasCommunityDropdown(false)
          !showDesktopSearch
            ? setFilterComponent(
                <SearchMenu
                  communityId={COMMUNITY}
                  initialResults={initialResults}
                />
              )
            : setFilterComponent(
                <SearchCollections
                  communityId={COMMUNITY}
                  initialResults={initialResults}
                />
              )
        }
      })
    }
  }, [filterableCollection, showDesktopSearch])

  if (!isMounted) {
    return null
  }

  return (
    <nav className="sticky top-0 z-[100000000000000] col-span-full flex items-center justify-between gap-2 border-b border-neutral-100 bg-white px-6 py-4 dark:border-neutral-900 dark:bg-black md:gap-3 md:py-4 md:px-12">
      <NavbarLogo className="max-w-60 z-10 " />
      <div className="z-10 ml-8 mr-8 hidden items-center gap-6 md:flex">
        <Link href="/how-it-works" legacyBehavior={true}>
          <a
            href="/how-it-works"
            className="text-dark reservoir-h6 truncate font-medium dark:text-white"
          >
            How it Works
          </a>
        </Link>
        <Link href="/rewards" legacyBehavior={true}>
          <a
            href="/rewards"
            className="text-dark reservoir-h6 truncate font-medium dark:text-white"
          >
            Rewards
          </a>
        </Link>
      </div>

      {(hasCommunityDropdown || showDesktopSearch) && (
        <div className="flex h-full items-center justify-center">
          {filterComponent && filterComponent}
        </div>
      )}
      {isMobile ? (
        <div className="ml-auto flex gap-x-5">
          {!hasCommunityDropdown && filterComponent && filterComponent}
          <CartMenu />
          <HamburgerMenu />
        </div>
      ) : (
        <div className="z-10 ml-auto shrink-0 gap-2 md:flex xl:gap-4">
          {!hasCommunityDropdown && !showDesktopSearch && (
            <div className="ml-auto flex">
              {filterComponent && filterComponent}
            </div>
          )}

          {isConnected ? (
            <div className="flex flex-row items-center justify-between gap-4">
              <Link href={`/address/${account.address}`} legacyBehavior={true}>
                <a
                  href={`/address/${account.address}`}
                  className="reservoir-h6 flex flex-row items-center justify-center gap-1 font-medium"
                >
                  <TbSquareRoundedPlusFilled className="h-5 w-5 text-black dark:text-white" />

                  <div>List NFT</div>
                </a>
              </Link>
              <CartMenu />
              {/* <SelectChain /> */}
              <TicketCount />

              <ConnectWallet />
            </div>
          ) : (
            <ConnectWallet />
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
