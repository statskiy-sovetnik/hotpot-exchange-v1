import React from 'react'
import useMounted from 'hooks/useMounted'
import { FC, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { getLatestPot, PotData, Pots } from 'lib/getLatestPot'
import { getPotById } from 'lib/getPotById'
import { Item } from '../lib/getPrizePool'
import { ethers } from 'ethers'
import ResultsModal from './modal/ResultsModal'
import usePrizePool from 'hooks/usePrizePool'
import useTicketCost from 'hooks/useTicketCost'
import useRafflePotId from 'hooks/useRafflePotId'
import ButtonGradient from './ButtonGradient'

interface TicketsGridProps {
  prizePool?: Item | null
}

const MyTicketsGrid: FC<TicketsGridProps> = () => {
  const { data: prizePool } = usePrizePool()
  const [tab, setTab] = useState<string>('current')
  const [currentPotData, setCurrentPotData] = useState<PotData | null>(null)
  const [latestRafflePot, setLatestRafflePot] = useState<PotData | null>(null)
  const [previousData, setPreviousData] = useState<PotData | null>(null)
  const { data: rafflePotId } = useRafflePotId()
  const currentPotSize = parseFloat(prizePool?.currentPotSize ?? '0')
  const potLimit = parseFloat(prizePool?.potLimit ?? '0')
  const { data: ticketCost } = useTicketCost()
  const [tabData, setTabData] = useState<Pots[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [pendingAmount, setPendingAmount] = useState<string>('')
  const account = useAccount()
  //Change address for testing
  const { address } = useAccount()
  const isMounted = useMounted()

  const tabs = []

  if (rafflePotId) {
    for (let i = rafflePotId?.pot_id - 1; i >= 1; i--) {
      tabs.push({ pot_id: i })
    }
  }

  useEffect(() => {
    if (account.isConnected && rafflePotId) {
      const fetchLatestPotData = async () => {
        if (address) {
          const { currentPot, pots } = await getLatestPot(address)
          if (pots) {
            const potsWithRaffle = pots.filter(
              (pot) => pot.raffle_timestamp !== null
            )

            const lastPots = potsWithRaffle.reverse().slice(1)

            // Filter out tickets with pending_amount
            if (currentPot) {
              const currentPotWithoutPending = {
                ...currentPot,
                tickets: currentPot.tickets.filter(
                  (ticket) => ticket.pending_amount === '0'
                ),
              }
              //Store the pending_amount
              const firstPendingTicket = currentPot.tickets.find(
                (ticket) => ticket.pending_amount !== '0'
              )

              setPendingAmount(
                firstPendingTicket ? firstPendingTicket.pending_amount : ''
              )

              // Calculate the updated NumOfTickets - pending amount ticket
              const updatedNumOfTickets =
                currentPotWithoutPending.tickets.length

              setCurrentPotData(currentPotWithoutPending)
              setTabData(lastPots)

              setCurrentPotData((prevData) => ({
                ...(prevData as PotData),
                NumOfTickets: updatedNumOfTickets,
              }))
            }
            // To render the first tab of my past tickets
            if (address) {
              const potData = await getPotById(address, rafflePotId?.pot_id)
              if (potData) {
                // Filter out tickets with pending_amount
                const potDataWithoutPending = {
                  ...potData,
                  tickets: potData.tickets.filter(
                    (ticket) => ticket.pending_amount === '0'
                  ),
                }

                setLatestRafflePot(potDataWithoutPending)
                setLoading(false)
              } else {
                setError(new Error('Failed to fetch pot data.'))
                setLoading(false)
              }
            }
          }
        }
      }

      fetchLatestPotData()
    }
    setTab('current')
  }, [address, rafflePotId])

  const pendingAmountEth =
    pendingAmount && ethers.utils.formatEther(pendingAmount)
  const potFill =
    (pendingAmountEth &&
      ticketCost &&
      Math.round(
        (parseFloat(pendingAmountEth) / parseFloat(ticketCost)) * 100
      )) ||
    0

  // Fetches the rest of the previous pots on tab click
  const handleTabClick = async (potId: number) => {
    setPreviousData(null)
    setLoading(true)
    setError(null)

    if (potId && address) {
      const potData = await getPotById(address, potId)

      if (potData) {
        // Filter out tickets with pending_amount
        const potDataWithoutPending = {
          ...potData,
          tickets: potData.tickets.filter(
            (ticket) => ticket.pending_amount === '0'
          ),
        }

        setPreviousData(potDataWithoutPending)
        setLoading(false)
      } else {
        setError(new Error('Failed to fetch pot data.'))
        setLoading(false)
      }
    }
  }

  const filteredTickets =
    tab === 'current' ? latestRafflePot?.tickets : previousData?.tickets

  if (!isMounted) {
    return null
  }
  return (
    <>
      <div className="flex flex-row items-center justify-between md:mt-7">
        <div className="text-lg font-medium reservoir-h1 md:text-2xl">
          My Current Tickets: {currentPotData?.NumOfTickets || '0'}
        </div>
        <Link href="/rewards" legacyBehavior={true}>
          <ButtonGradient>View Rewards</ButtonGradient>
        </Link>
      </div>

      {/* Reward Info Cards */}
      {/* <div className="flex flex-col w-full gap-4 mt-8 md:flex-row">
        <Card
          title="Total Pots Drawn"
          value={rafflePotId?.pot_id || 0}
          imageSrc="badges/pots-drawn.png"
          circleColor="bg-[#EFF8FF]"
        />
        <Card
          title="My Total Tickets"
          value={currentPotData?.NumOfTickets}
          imageSrc="badges/total-tickets.png"
          circleColor="bg-[#F9F5FF]"
        />
      </div> */}

      {/* Current Pot */}
      <div className="w-full mt-8">
        <div className="my-4  flex border-b border-b border-[rgba(0,0,0,0.05)] text-sm font-normal text-[#98A2B3]  dark:border-[rgba(255,255,255,0.2)]">
          <div
            className="reservoir-h1 border-b-2 border-[#620DED] py-4 px-8 
              
               text-base font-medium text-[#620DED]  dark:text-white"
          >
            Current POT
          </div>
        </div>
        {currentPotData?.NumOfTickets === 0 ||
        currentPotData?.NumOfTickets === undefined ? (
          <div className="p-2 mx-4 text-sm dark:text-gray-300">No tickets</div>
        ) : (
          <div className="grid-rows-10 md:grid-rows-19 no-scrollbar m-4 grid max-h-[500px] grid-cols-4 gap-4 overflow-auto p-2 md:grid-cols-8 lg:grid-cols-10 2xl:grid-cols-12">
            {/* Ticket with Pending Amount */}

            {currentPotData && (
              <div className="reservoir-h1 relative mx-2 flex h-[45px] w-[85px] bg-[url('/pending-ticket.svg')] text-sm font-medium text-white">
                <div
                  className="flex h-[45px] w-[85px] items-center justify-center bg-[url('/ticket.svg')]"
                  style={{ width: `${potFill}%` }}
                >
                  {potFill >= 1 && (
                    <span className="absolute right-0 flex items-center justify-center left-1">
                      {potFill}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Current POT Tickets*/}

            {currentPotData?.tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className="reservoir-h1 mx-2 flex h-[45px] w-[85px] cursor-default items-center  justify-center bg-[url('/ticket.svg')]  
                
                  text-sm font-light text-white"
              >
                <div>#{ticket.ticket_id}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Past Tickets - Pots are already drawn */}

      <div className="mt-[50px] w-full">
        <div className="text-lg font-medium reservoir-h1 md:text-2xl">
          My Past Tickets
        </div>
        <div className="my-4  flex border-b border-b border-[rgba(0,0,0,0.05)] text-sm font-normal text-[#98A2B3]  dark:border-[rgba(255,255,255,0.2)]">
          <button
            className={`reservoir-h1 py-4 px-4 text-base font-medium md:px-8 ${
              tab === 'current'
                ? 'border-b-2 border-[#620DED] text-[#620DED]  dark:text-white '
                : ''
            }`}
            onClick={() => setTab('current')}
          >
            POT #{rafflePotId?.pot_id}
          </button>
          {/* Previous POT Ids - Tab  */}
          {rafflePotId &&
            tabs?.map((pot, index) => (
              <button
                key={index}
                className={`reservoir-h1 py-4 px-4 text-base font-medium md:px-8 ${
                  tab === `tab${index}`
                    ? 'border-b-2 border-[#620DED] text-[#620DED] dark:text-white '
                    : ''
                }`}
                onClick={() => {
                  setTab(`tab${index}`)
                  handleTabClick(pot.pot_id)
                }}
              >
                POT #{pot.pot_id}
              </button>
            ))}
        </div>
        {filteredTickets?.length === 0 ||
        filteredTickets === undefined ||
        filteredTickets === null ? (
          <div className="p-2 mx-4 text-sm dark:text-gray-300">No tickets</div>
        ) : (
          <div className="grid-rows-10 md:grid-rows-19 no-scrollbar m-4 grid max-h-[500px] grid-cols-4 gap-4 overflow-auto p-2 md:grid-cols-8 lg:grid-cols-10 2xl:grid-cols-12">
            {/* Winning tickets and past tickets render conditions*/}

            {filteredTickets?.map((ticket) => (
              <div
                key={ticket.ticket_id}
                className={`reservoir-h1 mx-2 flex h-[45px] w-[85px] items-center justify-center  text-sm font-light  ${
                  ticket.is_winner
                    ? "cursor-pointer bg-[url('/winning-ticket.svg')] text-black transition-transform hover:scale-105 dark:text-black"
                    : tab === 'current'
                    ? "cursor-default bg-[url('/previous-ticket.svg')] text-[#A58AF9]"
                    : "cursor-default bg-[url('/previous-ticket.svg')] text-[#A58AF9]"
                }`}
              >
                {/* Opens the results modal on click if it's a winning ticket */}

                {tab !== 'current' && ticket.is_winner ? (
                  <>
                    <ResultsModal trigger={<div>#{ticket.ticket_id}</div>} />
                  </>
                ) : (
                  <div>#{ticket.ticket_id}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

interface CardProps {
  title?: string
  value?: number
  imageSrc?: string
  circleColor?: string
}

const Card: React.FC<CardProps> = ({ title, value, imageSrc, circleColor }) => {
  return (
    <div className="flex h-[118px] w-full flex-col gap-2 rounded-lg border border-[#EAECF0] p-6 dark:border-none dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-800 md:w-[316px]">
      <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {title}
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="text-3xl font-semibold">{value}</div>
        <div
          className={`flex items-center justify-center rounded-full  p-3 dark:bg-black ${circleColor}`}
        >
          <img src={imageSrc} className="w-4 h-4" alt={title} />
        </div>
      </div>
    </div>
  )
}

export default MyTicketsGrid
