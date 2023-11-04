import { FC, useState, useEffect } from 'react'
import ConnectWalletButton from './ConnectWalletButton'
import { useAccount } from 'wagmi'
import { getLatestPot, PotData, Pots } from 'lib/getLatestPot'
import { getPotById } from 'lib/getPotById'
import { Item } from '../lib/getPrizePool'
import useMounted from 'hooks/useMounted'
import ResultsModal from './modal/ResultsModal'
import usePrizePool from 'hooks/usePrizePool'
import { ethers } from 'ethers'
import useTicketCost from 'hooks/useTicketCost'
import { RiWalletLine } from 'react-icons/ri'
import ConnectWalletButtonSecondary from './ConnectWalletButtonSecondary'

interface TicketsGridProps {
  prizePool?: Item | null
}

const TicketsGrid: FC<TicketsGridProps> = () => {
  const { data: prizePool } = usePrizePool()
  const [tab, setTab] = useState<string>('current')
  const [data, setData] = useState<PotData | null>(null)
  const [previousData, setPreviousData] = useState<PotData | null>(null)
  const currentPotSize = parseFloat(prizePool?.currentPotSize ?? '0')
  const potLimit = parseFloat(prizePool?.potLimit ?? '0')
  const { data: ticketCost } = useTicketCost()
  const [tabs, setTabs] = useState<Pots[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [pendingAmount, setPendingAmount] = useState<string>('')
  const account = useAccount()
  //Change address for testing
  const { address } = useAccount()
  const isMounted = useMounted()
  const dummyTicket = 1234

  useEffect(() => {
    if (account.isConnected) {
      const fetchLatestPotData = async () => {
        if (address) {
          const { currentPot, pots } = await getLatestPot(address)
          if (pots) {
            const potsWithRaffle = pots.filter(
              (pot) => pot.raffle_timestamp !== null
            )
            const lastTwoPots = potsWithRaffle.slice(-2)

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

              // Calculate the updated NumOfTickets
              const updatedNumOfTickets =
                currentPotWithoutPending.tickets.length

              setData(currentPotWithoutPending)
              setTabs(lastTwoPots)

              setData((prevData) => ({
                ...(prevData as PotData),
                NumOfTickets: updatedNumOfTickets,
              }))
            }
          }
        }
      }

      fetchLatestPotData()
    }
    setTab('current')
  }, [address])

  const pendingAmountEth =
    pendingAmount && ethers.utils.formatEther(pendingAmount)
  const potFill =
    (pendingAmountEth &&
      ticketCost &&
      Math.round(
        (parseFloat(pendingAmountEth) / parseFloat(ticketCost)) * 100
      )) ||
    0

  const handleTabClick = async (potId: number) => {
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
    tab === 'current' ? data?.tickets : previousData?.tickets

  return (
    <>
      {account.isDisconnected || !isMounted || !address ? (
        <div className="relative">
          <div className="absolute inset-x-0 top-1/4 z-20 mx-auto flex h-[260px] w-[350px] items-center justify-center rounded bg-neutral-100  dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600 md:w-[450px]">
            <div className="flex flex-col items-center justify-center gap-4">
              <RiWalletLine className="w-10 h-10" />

              <div className="text-2xl font-medium reservoir-h1">
                Connect Wallet
              </div>
              <div className="reservoir-h1 w-[280px] text-center text-sm font-normal text-neutral-500">
                Connect your wallet to see your tickets
              </div>
              <ConnectWalletButtonSecondary>
                <div> Connect Wallet</div>
              </ConnectWalletButtonSecondary>
            </div>
          </div>
          <div className="relative z-0 p-2 bg-opacity-50 rounded-md blur-lg">
            <div className="my-4 mx-4 flex border-b border-b-[#E1D8FD] text-sm font-normal text-[#98A2B3]">
              <button className="${'border-b-2 border-[#6A3CF5] p-4 font-medium  text-[#6A3CF5]">
                Current
              </button>
              <button className="p-4 font-medium">7 July 2023</button>
              <button className="p-4 font-medium">7 June 2023</button>
            </div>

            <h2 className="m-4 font-medium text-[#FF60D5]">My Tickets: 1445</h2>
            <div className="grid-rows-10 md:grid-rows-19 m-4 grid min-h-[200px] grid-cols-5 gap-4 md:grid-cols-8 lg:grid-cols-10 2xl:grid-cols-12">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="reservoir-h1 mx-2 flex h-[45px] w-[85px] items-center justify-center  bg-[url('/ticket.svg')] text-sm font-light text-white"
                >
                  <div>#{dummyTicket}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full mt-8">
          <div className="my-4  flex border-b border-b border-[rgba(0,0,0,0.05)] text-sm font-normal text-[#98A2B3]  dark:border-[rgba(255,255,255,0.2)]">
            <button
              className={`reservoir-h1 py-4 px-8 text-base font-medium ${
                tab === 'current'
                  ? 'border-b-2 border-[#620DED] text-[#620DED]  dark:text-white '
                  : ''
              }`}
              onClick={() => setTab('current')}
            >
              Current
            </button>
            {tabs?.map((pot, index) => (
              <button
                key={index}
                className={`reservoir-h1 py-4 px-8 text-base font-medium ${
                  tab === `tab${index}`
                    ? 'border-b-2 border-[#620DED] text-[#620DED]  dark:text-white '
                    : ''
                }`}
                onClick={() => {
                  setTab(`tab${index}`)
                  handleTabClick(pot.pot_id)
                }}
              >
                {new Date(pot.raffle_timestamp!).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </button>
            ))}
          </div>

          <h2 className="m-4 font-medium text-[#FF60D5]">
            My Tickets: {data?.NumOfTickets || '0'}
          </h2>
          {(tab === 'current' && data?.NumOfTickets === 0) ||
          data?.NumOfTickets === undefined ? (
            <div className="p-2 mx-4 text-sm dark:text-gray-300">
              No tickets
            </div>
          ) : (
            <div className="grid-rows-10 md:grid-rows-19 no-scrollbar m-4 grid max-h-[500px] grid-cols-4 gap-4 overflow-auto p-2 md:grid-cols-8 lg:grid-cols-10 2xl:grid-cols-12">
              {tab === 'current' && data && (
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
              {/* Winning tickets and normal tickets*/}

              {filteredTickets?.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className={`reservoir-h1 mx-2 flex h-[45px] w-[85px] items-center justify-center  text-sm font-light  ${
                    ticket.is_winner
                      ? "cursor-pointer bg-[url('/winning-ticket.svg')] text-black transition-transform hover:scale-105 dark:text-black"
                      : tab === 'current'
                      ? "cursor-default bg-[url('/ticket.svg')] text-white"
                      : "cursor-default bg-[url('/previous-ticket.svg')] text-[#A58AF9]"
                  }`}
                >
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
      )}
    </>
  )
}

export default TicketsGrid
