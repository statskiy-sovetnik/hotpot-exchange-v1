import React, { FC, useState } from 'react'

const Header: FC = () => {
  const [controlsVisible, setControlsVisible] = useState(false)

  const toggleControls = () => {
    setControlsVisible(!controlsVisible)
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
      <div className="grid  w-full  grid-cols-1 gap-6 overflow-hidden rounded-lg bg-[url('/how-it-works-bg.svg')] bg-cover bg-center bg-no-repeat px-2 py-6 md:max-h-[26rem] md:grid-cols-2 md:p-6">
        <div className="flex flex-col justify-center gap-6 px-2 py-6 text-white md:p-6 ">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <h1 className="text-4xl font-bold md:text-5xl 2xl:text-6xl">
              How it Works
            </h1>
            <p className="font-base text-center text-xs md:text-left md:text-sm md:text-base">
              Earn 1 raffle ticket for every 0.05 ETH bought or sold
            </p>
          </div>
          <div className="flex flex-row items-center justify-center md:justify-start ">
            <a href="https://chain.link/vrf" target="_blank">
              <img
                src="https://chain.link/badge-randomness-white"
                alt="randomness secured with chainlink"
                className="h-[46px]  rounded-lg  object-contain dark:hidden md:h-[50px] "
              />
            </a>

            <a href="https://chain.link/vrf" target="_blank">
              <img
                src="https://chain.link/badge-randomness-black"
                alt="randomness secured with chainlink"
                className="hidden  h-[50px] h-[46px]  object-contain  object-contain  dark:block md:h-[50px] "
              />
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          {' '}
          <div className="col-span-1 flex items-center justify-center">
            <video
              width="500"
              height="500"
              poster="/video-thumbnail.png"
              controls={controlsVisible}
              onClick={toggleControls}
              className="rounded-lg shadow-lg"
            >
              <source
                src="https://res.cloudinary.com/dxiqdqwcy/video/upload/v1697143903/hotpot_explainer_kp2vx4.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
