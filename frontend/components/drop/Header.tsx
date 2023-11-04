import React, { FC } from 'react'
import { FaRegDotCircle } from 'react-icons/fa'
import DropSocialLinks from './DropSocialLinks'
import { RiVerifiedBadgeFill } from 'react-icons/ri'

const Header: FC = () => {
  return (
    <div className="grid min-h-[400px] grid-cols-1 gap-4 bg-[url('/how-it-works-bg.svg')] bg-cover bg-center bg-no-repeat px-6 md:grid-cols-1">
      <div className="grid w-full grid-cols-1 gap-6 overflow-hidden px-2 py-6 md:grid-cols-2 md:p-6">
        <div className="flex flex-col justify-end gap-6 px-2 py-6 text-white md:p-6">
          <div className="flex flex-col items-center gap-6 md:items-start">
            <h1 className="text-4xl font-bold md:text-6xl 2xl:text-7xl">
              Drop
            </h1>
            <div className="flex flex-col gap-2">
              <p className="text-center text-xl font-medium md:text-left md:text-4xl md:text-base">
                Crates by Hotpot
                <RiVerifiedBadgeFill className="ml-2 inline-flex h-6 w-6 items-center justify-center text-white" />
              </p>
              <p className="text-center text-sm font-normal md:text-left md:text-xl ">
                By Hotpot
                <RiVerifiedBadgeFill className="ml-2 inline-flex h-4 w-4 items-center justify-center text-white" />
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-12 md:justify-end">
          <div className="col-span-1 flex items-center justify-center"></div>
        </div>
      </div>

      {/* Mint and social links */}
      <div className="flex flex-row items-center justify-between px-12 py-6">
        <div className="rounded-lg border px-5 py-3">
          <div className="flex flex-row items-center justify-center gap-2">
            <FaRegDotCircle className="h-3 w-3 animate-ping text-green-300" />
            <span className="text-sm font-medium text-white">Minting</span>
          </div>
        </div>
        <div>
          <DropSocialLinks />
        </div>
      </div>
    </div>
  )
}

export default Header
