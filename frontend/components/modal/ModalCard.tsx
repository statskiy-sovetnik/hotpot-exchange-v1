import React, { FC, ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { HiX } from 'react-icons/hi'
import Steps from 'components/Steps'
import { Execute } from '@reservoir0x/reservoir-sdk'
import FormatNativeCrypto from 'components/FormatNativeCrypto'

type Props = {
  loading: boolean
  onCloseCallback?: () => any
  actionButton?: ReactNode
  steps?: Execute['steps']
  title: string
  children?: ReactNode
}

const ModalCard: FC<Props> = ({
  actionButton,
  children,
  loading,
  onCloseCallback,
  steps,
  title,
}) => {
  // If all executed, then success is true
  const success =
    !loading &&
    steps &&
    steps.every((step: any) => {
      if (!step.items || step.items.length == 0) {
        return true
      } else {
        return step.items.every((item: any) => item.status === 'complete')
      }
    })

  return (
    <Dialog.Content className="fixed inset-0 z-[10000000000] bg-[#000000b6]">
      <div className="fixed w-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-5">
          <div
            className="${ mx-auto overflow-hidden rounded-t-2xl border border-neutral-300 bg-white p-11 shadow-xl dark:border-neutral-600 dark:bg-black
               md:w-[510px]"
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="reservoir-h4 font-headings dark:text-white">
                {title}
              </Dialog.Title>
              <Dialog.Close
                onClick={onCloseCallback}
                className="btn-primary-outline p-1.5 dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
              >
                <HiX className="w-5 h-5" />
              </Dialog.Close>
            </div>
            {steps ? <Steps steps={steps} /> : children}
            {success ? (
              <Dialog.Close
                onClick={onCloseCallback}
                className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
              >
                Success, Close this menu
              </Dialog.Close>
            ) : (
              <div className="flex gap-4">
                <Dialog.Close
                  onClick={onCloseCallback}
                  className="w-full btn-primary-outline dark:border-neutral-600 dark:text-white dark:ring-primary-900 dark:focus:ring-4"
                >
                  Cancel
                </Dialog.Close>
                {actionButton}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog.Content>
  )
}

export default ModalCard

export const ListPrice = ({
  floorSellValue,
}: {
  floorSellValue: number | undefined
}) => {
  if (floorSellValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5 text-[#111827]">
        <span className="whitespace-nowrap">List Price</span>
        <div>
          <FormatNativeCrypto amount={floorSellValue} logoWidth={7} />
        </div>
      </div>
    )
  }

  return null
}

export const TopOffer = ({
  topBuyValue,
}: {
  topBuyValue: number | undefined
}) => {
  if (topBuyValue) {
    return (
      <div className="reservoir-label-m flex items-center gap-2 rounded-[8px] bg-[#E2CCFF] px-2 py-0.5">
        <span className="whitespace-nowrap">Current Top Offer</span>
        <div>
          <FormatNativeCrypto amount={topBuyValue} logoWidth={7} />
        </div>
      </div>
    )
  }

  return null
}
