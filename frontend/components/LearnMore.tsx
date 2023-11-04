import React, { FC, ReactNode } from 'react'

const LearnMore: FC = () => {
  return (
    <div className="mt-12">
      <h1 className="reservoir-h1 text-3xl font-medium text-[#7436F5]">
        Learn More
      </h1>
      <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-4">
        <Card title="How to Earn">
          To earn a raffle ticket, trade 0.05 ETH of eligible NFTs — separate
          trades adding up to 0.05 ETH count!
        </Card>
        <Card title="Provably Fair">
          The Pot O’ Gold is a provably-fair, fully on-chain, reward system
          using Chainlink VRF to ensure fair outcomes.
        </Card>
        <Card title="The Drawing Process">
          The entirety of the 1% fee goes into the pot. Once the pot is full, it
          will automatically draw a winning ticket.
        </Card>
        <Card title="Eligible Collections">
          Only collections with (Hotpot) icon{' '}
          <img
            src="hotpot.png"
            className="flex inline-flex inline w-5 h-5 mr-1"
          />
          are eligible to earn raffle tickets
        </Card>
      </div>
    </div>
  )
}

interface CardProps {
  title: string
  children?: ReactNode
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="flex flex-col justify-start gap-4 rounded-lg border border-[#F6F6F6] p-6 shadow-sm dark:border-neutral-600">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="text-sm font-normal reservoir-h1">{children}</div>
    </div>
  )
}

export default LearnMore
