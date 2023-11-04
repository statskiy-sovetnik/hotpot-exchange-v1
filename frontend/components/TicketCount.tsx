import React, { FC, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { getLatestPot } from 'lib/getLatestPot'
import { setToast } from './token/setToast'
import Link from 'next/link'
import useSWR from 'swr'

interface PotData {
  NumOfTickets: number
  wallet_address: string
  pot_id: number
  tickets: { ticket_id: number; is_winner: boolean; pending_amount: string }[]
}

const TicketCount: FC = () => {
  const account = useAccount()
  const { address } = useAccount()
  const { data } = useSWR(address ? ['latestPot', address] : null, () =>
    address ? getLatestPot(address) : null
  )
  const [prevTicketCount, setPrevTicketCount] = useState<number | null>(null)
  const [filteredTickets, setFilteredTickets] = useState<
    PotData['tickets'] | null
  >(null)

  useEffect(() => {
    if (data?.currentPot) {
      if (
        prevTicketCount !== null &&
        data.currentPot.NumOfTickets > 0 &&
        data.currentPot.NumOfTickets !== prevTicketCount
      ) {
        setToast({
          kind: 'tickets',
          message: '',
          title: 'You have earned Golden Tickets!',
        })
      }

      setPrevTicketCount(data.currentPot.NumOfTickets)
    }
  }, [data])

  useEffect(() => {
    // Filter out tickets with pending_amount '0'
    if (data && data.currentPot) {
      const filtered = data.currentPot.tickets.filter(
        (ticket) => ticket.pending_amount === '0'
      )
      setFilteredTickets(filtered)
    }
  }, [data])

  if (!address) {
    return null
  }

  if (account.isConnected) {
    {
      return (
        <>
          <Link href="/tickets" legacyBehavior={true}>
            <button className="group relative mx-1  inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-0.5 text-sm font-medium text-gray-900 hover:from-[#620DED] hover:to-[#620DED] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800">
              <span className="relative px-5 py-2 bg-white rounded-md group-hover:bg-opacity-0 dark:bg-gray-900">
                {filteredTickets && filteredTickets.length > 0
                  ? filteredTickets.length
                  : '0'}{' '}
                TIX
              </span>
            </button>
          </Link>
        </>
      )
    }
  }
  return null
}

export default TicketCount
