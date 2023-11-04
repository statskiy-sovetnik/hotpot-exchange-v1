import PrizePoolWidget from 'components/PrizePoolWidget'
import useTicketCost from 'hooks/useTicketCost'
import Link from 'next/link'
import React, { FC } from 'react'

const Header: FC = () => {
  const { data: ticketCost } = useTicketCost()
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
      <div className="grid  w-full  grid-cols-1 gap-6 overflow-hidden rounded-lg bg-[url('/how-it-works-bg.svg')] bg-cover bg-center bg-no-repeat px-2 py-6 md:max-h-[26rem] md:grid-cols-2 md:p-6">
        <div className="flex flex-col justify-center gap-6 p-2 text-white md:p-6 ">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <h1 className="text-center text-4xl font-bold md:text-left md:text-5xl 2xl:text-6xl">
              Hotpot Rewards
            </h1>
            <p className="font-base text-center text-xs md:text-left md:text-sm md:text-base">
              Earn 1 raffle ticket for every {ticketCost} ETH bought or sold
            </p>
          </div>

          <div className="mt-2 flex items-center justify-center md:justify-start">
            <div className="grid w-[90%] grid-cols-2 gap-3  md:w-2/3 md:gap-3">
              <div className="col-span-1 items-center justify-center">
                <a href="https://chain.link/vrf" target="_blank">
                  <img
                    src="https://chain.link/badge-randomness-white"
                    alt="randomness secured with chainlink"
                    className="h-[46px]  rounded-lg  object-contain dark:hidden md:h-[54px] "
                  />
                </a>

                <a href="https://chain.link/vrf" target="_blank">
                  <img
                    src="https://chain.link/badge-randomness-black"
                    alt="randomness secured with chainlink"
                    className="hidden   h-[46px]  object-contain  object-contain  dark:block md:h-[54px]"
                  />
                </a>
              </div>

              <div className="col-span-1 items-center justify-center">
                <Link href="/how-it-works" legacyBehavior={true}>
                  <a href="/how-it-works">
                    <button
                      id="secondary CTA"
                      className="pointer-cursor flex transform items-center justify-center truncate rounded-lg border border-white px-3 py-3 text-sm font-medium text-white transition-transform hover:scale-105 md:rounded-lg md:py-3 md:px-5 md:text-base"
                    >
                      See How it Works
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end pb-6 md:pb-0">
          <PrizePoolWidget />
        </div>
      </div>
    </div>
  )
}

export default Header
