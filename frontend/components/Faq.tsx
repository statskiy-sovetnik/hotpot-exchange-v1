import * as Accordion from '@radix-ui/react-accordion'
import { FC } from 'react'
import { FiChevronDown } from 'react-icons/fi'
const Faq: FC = () => {
  return (
    <div className="mt-12 ">
      <h1 className="reservoir-h1 mb-8 text-3xl font-medium text-[#7436F5]">
        FAQ
      </h1>
      <Accordion.Root
        type="single"
        defaultValue="item-1"
        collapsible
        className="mb-4 "
      >
        <Accordion.Item
          value="item-1"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              What is the Pot O' Gold?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              The Pot O' Gold is a provably-fair jackpot where users can win 1
              ETH by trading NFTs.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-2"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              How do I earn raffle tickets?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              Raffle tickets are automatically earned for every 0.05 ETH of NFTs
              bought or sold.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-3"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Do separate trades adding up to 0.05 ETH reward tickets?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              Yes! We always keep track. Trades below 0.05 ETH work towards a
              full raffle ticket.
            </div>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          value="item-4"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Can I buy raffle tickets?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              No, tickets can only be earned by trading NFTs.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-5"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              How does the Pot O' Gold fill up?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              Hotpot takes a 1% marketplace fee on sales which is all sent to
              the pot.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-6"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Where do I claim my winnings?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              When the pot draws, a 'check results' banner will display at the
              top of the page. You can also claim on your rewards page.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-7"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Is it provably fair?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              Yes! We use Chainlink VRF to generate a verifiable random number
              when drawing the winner.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-8"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Are raffle tickets on-chain?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              Are raffle tickets on-chain?
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          value="item-9"
          className="p-4 mb-2 overflow-hidden bg-white border rounded-lg first:mt-0 focus-within:relative focus-within:z-10 dark:border-0 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-600"
        >
          <Accordion.Trigger className="group flex h-[28px] w-full cursor-pointer items-center justify-between rounded-md bg-white py-4 px-5 leading-none text-violet11  shadow-mauve6 outline-none  dark:bg-neutral-900  ">
            <h1 className="text-sm font-medium text-left text-black dark:text-neutral-100 md:text-base">
              Will I earn tickets for listings from aggregated marketplaces?
            </h1>
            <FiChevronDown
              className=" transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180 dark:text-neutral-100"
              aria-hidden
            />
          </Accordion.Trigger>
          <Accordion.Content className="mt-2 overflow-hidden border-t border-neutral-100 data-[state=open]:animate-slideDown  data-[state=closed]:animate-slideUp dark:border-neutral-700 ">
            <div className=" reservoir-h1 px-5 pt-4 pb-1 text-sm font-normal text-[#3B3B4F]">
              No, you can only earn raffle tickets from NFTs listed on Hotpot.
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export default Faq
