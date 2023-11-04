import React, { FC, useState } from 'react'
import { useAccount } from 'wagmi'

interface CardData {
  title: string
  subtitle1: string
  subtitle2: string
  subtitle3: string
  buyLink?: string
  listLink?: string
}

interface ExplainerCardsProps {
  cardData?: CardData[]
}

const ExplainerCards: FC<ExplainerCardsProps> = ({ cardData }) => {
  const account = useAccount()
  const [controlsVisible, setControlsVisible] = useState(false)

  const toggleControls = () => {
    setControlsVisible(!controlsVisible)
  }

  const defaultCardData: CardData[] = [
    {
      title: 'How it Works',
      subtitle1:
        'The Pot O’ Gold is a provably-fair, fully on-chain, reward system using Chainlink VRF to ensure fair outcomes.',

      subtitle2:
        'To earn a raffle ticket, trade 0.05 ETH of eligible NFTs — separate trades adding up to 0.05 ETH count!',
      subtitle3:
        'The entirety of our 1% marketplace fee goes into the pot. Once it is full, it will automatically draw a winning ticket.',

      buyLink: '/#hotpot-listings',
      listLink: `/address/${account.address}`,
    },
  ]

  const cardsToRender = cardData || defaultCardData

  return (
    <div className="mt-11 grid grid-cols-1 gap-4 md:grid-cols-1">
      {cardsToRender.map((data, index) => (
        <div
          key={index}
          className="rounded-xl bg-neutral-100 py-4 dark:bg-neutral-900 dark:text-neutral-300"
        >
          <div className="flex w-full flex-col gap-4 rounded-2xl px-6 py-6 md:gap-2 md:py-4 md:px-6">
            <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3 md:justify-between">
              <div className="items-left col-span-1 flex flex-col gap-4 md:col-span-2">
                <div className="flex flex-row items-center justify-between">
                  <h1 className="reservoir-h1 text-2xl font-semibold text-[#030303] dark:text-neutral-100 md:text-3xl">
                    {data.title}
                  </h1>
                </div>

                <div className="font-base my-2 space-y-6 pl-4 text-neutral-600 dark:text-neutral-300 md:text-base">
                  <ul className="list-disc space-y-2 text-[14px]">
                    <li>{data.subtitle1}</li>
                    <li>{data.subtitle2}</li>
                    <li>{data.subtitle3}</li>
                  </ul>
                </div>

                <div className="flex flex-row items-center justify-center md:justify-start ">
                  <div className="w-[250px] dark:hidden">
                    <a href="https://chain.link/vrf" target="_blank">
                      {' '}
                      <img
                        src="https://chain.link/badge-randomness-white"
                        alt="randomness secured with chainlink"
                        className=""
                      />
                    </a>
                  </div>
                  <div className="hidden w-[250px] dark:block">
                    <a href="https://chain.link/vrf" target="_blank">
                      {' '}
                      <img
                        src="https://chain.link/badge-randomness-black"
                        alt="randomness secured with chainlink"
                        className=""
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:items-right mt-4 flex flex-col items-center justify-center md:mt-0 md:justify-end">
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
        </div>
      ))}
    </div>
  )
}

export default ExplainerCards
