import PrizePoolWidget from 'components/PrizePoolWidget'
import useTicketCost from 'hooks/useTicketCost'
import Link from 'next/link'
import React, { FC } from 'react'

const HeaderHome: FC = () => {
  const { data: ticketCost } = useTicketCost()
  return (
    <div className="grid h-full grid-cols-1 items-center justify-center gap-4 md:grid-cols-1">
      <div className="grid h-full w-full grid-cols-1 gap-6 overflow-hidden rounded-lg p-6 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-2 py-6 text-white md:p-6 ">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <h1 className="md:5xl text-4xl font-bold lg:text-6xl">
              Buy and Sell NFTs, Win Rewards
            </h1>
            <p className="font-base text-center text-sm md:text-left md:text-base">
              Earn 1 raffle ticket for every {ticketCost || '0.00'} ETH bought
              or sold
            </p>
          </div>
          <div className="mt-2 flex items-center justify-center md:justify-start">
            <div className="grid w-[90%] grid-cols-2 gap-3  md:w-2/3 md:gap-3">
              <div className="col-span-1 items-center justify-center">
                <Link href="/rewards" legacyBehavior={true}>
                  <button className=" before:ease relative w-full overflow-hidden truncate rounded-lg border border-[#FFF06A]  bg-gradient-to-b  from-[#FFE346] to-[#ffb01d] px-4  py-3 text-sm font-medium text-[#1D1D1D] shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-20 before:duration-700  hover:shadow-[#FFF06A] hover:before:-translate-x-56  md:py-3 md:text-sm lg:text-[16px]">
                    <span className="z-5 relative" id="primary-CTA">
                      Trade to Earn
                    </span>
                  </button>
                </Link>
              </div>

              <div className="col-span-1 items-center justify-center">
                <a href="#hotpot-listings">
                  <button
                    id="secondary CTA"
                    className="pointer-cursor flex w-full transform  items-center justify-center truncate rounded-lg border border-solid bg-white  px-4  py-3 text-sm font-medium text-[#1D1D1D] shadow-2xl transition-transform duration-300 hover:border-neutral-400 hover:text-[#1D1D1D] hover:shadow-white  md:rounded-lg md:py-3  md:text-sm lg:text-[16px]"
                  >
                    Buy NFTs
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-end pb-6 md:p-6">
          <div className="z-1 absolute inset-0 hidden translate-y-5 bg-[url(/coins-foreground.svg)] bg-contain bg-center bg-no-repeat md:flex"></div>
          <PrizePoolWidget />
        </div>
      </div>
    </div>
  )
}

export default HeaderHome
