import React, { FC } from 'react'

import { RiVerifiedBadgeFill } from 'react-icons/ri'
import ButtonGradient from 'components/ButtonGradient'

const MintInfo: FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
      <div className="grid w-full grid-cols-1 gap-6 overflow-hidden px-2 py-6 md:grid-cols-2 md:p-6">
        {/* Image */}
        <div className="items-left flex flex-col justify-start gap-6 py-6 text-white ">
          <img
            src="/new/mint-placeholder.png"
            className="w-[500px] rounded-lg bg-white object-cover"
          />
        </div>
        {/* About */}
        <div className="flex flex-col justify-center gap-4 px-12 py-6 md:justify-start">
          <h2 className="reservoir-h1 text-xl font-semibold">
            About this Collection
          </h2>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-center gap-2">
              <img src="/hotpot.png" className="h-6 w-6" />
              <div className="flex flex-row items-center">
                <h5 className="text-base font-medium">Crates by Hotpot</h5>
                <RiVerifiedBadgeFill className="ml-1 h-4 w-4 text-blue-500" />
              </div>
              <div className="rounded-lg bg-neutral-300 p-2 text-sm font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                Ethereum
              </div>
              <div className="rounded-lg bg-neutral-300 p-2 text-sm font-medium text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                ERC-721
              </div>
            </div>
          </div>
          {/* Collection Description */}
          <p className="font-base pb-2 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <br /> <br /> Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur.
            <br />
            <br /> Excepteur sint occaecat cupidatat non proident, sunt in culpa
            qui officia deserunt mollit anim id est laborum.
          </p>
          {/* Mint Button */}
          <div className="flex flex-row items-center justify-between py-2">
            <ButtonGradient className="">
              <div className="px-4 text-lg">Mint</div>
            </ButtonGradient>
          </div>
        </div>
      </div>
      {/* Mint and social links
      <div className="flex flex-row items-center justify-between px-12 py-6">
        <div className="px-5 py-3 border rounded-lg">
          <div className="flex flex-row items-center justify-center gap-2">
            <FaRegDotCircle className="w-3 h-3 text-green-300 animate-ping" />
            <span className="text-sm font-medium ">Minting</span>
          </div>
        </div>
        <div>
          <DropSocialLinks />
        </div>
      </div> */}
    </div>
  )
}

export default MintInfo
