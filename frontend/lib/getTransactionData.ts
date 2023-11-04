import { ethers } from 'ethers'
import { HOTPOT_ABI_G, MARKET_ABI_G } from '../contracts/index'

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_ID

const getTransactionData = async (transactionHash: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
  )

  try {
    // Get the transaction receipt
    const txReceipt = await provider.getTransactionReceipt(transactionHash)

    if (txReceipt) {
      const contract = new ethers.Contract(
        txReceipt.to, // Contract address from the receipt
        HOTPOT_ABI_G,
        provider
      )

      const hotpotContract = new ethers.Contract(
        txReceipt.to, // Contract address from the receipt
        MARKET_ABI_G,
        provider
      )

      //  "GenerateRaffleTickets" event
      const generateRaffleTicketsTopicHash = ethers.utils.id(
        'GenerateRaffleTickets(address,address,uint32,uint32,uint32,uint32,uint256,uint256)'
      )

      // "OrderFulfilled" event
      const orderFulfilledTopicHash = ethers.utils.id(
        'OrderFulfilled(address,address,address,uint256,uint256,bytes32)'
      )

      // Filter the logs based on the event topic hashes
      const generateRaffleTicketsLogs = txReceipt.logs.filter(
        (log) => log.topics[0] === generateRaffleTicketsTopicHash
      )

      const orderFulfilledLogs = txReceipt.logs.filter(
        (log) => log.topics[0] === orderFulfilledTopicHash
      )

      // Event objects for "GenerateRaffleTickets"
      const parsedGenerateRaffleTicketsLogs = generateRaffleTicketsLogs.map(
        (log) => {
          const decodedLog = contract.interface.parseLog(log)
          return {
            event: 'GenerateRaffleTickets',
            _buyer: decodedLog.args._buyer,
            _seller: decodedLog.args._seller,
            _buyerTicketIdStart: decodedLog.args._buyerTicketIdStart,
            _buyerTicketIdEnd: decodedLog.args._buyerTicketIdEnd,
            _sellerTicketIdStart: decodedLog.args._sellerTicketIdStart,
            _sellerTicketIdEnd: decodedLog.args._sellerTicketIdEnd,
            _buyerPendingAmount: decodedLog.args._buyerPendingAmount.toString(),
            _sellerPendingAmount:
              decodedLog.args._sellerPendingAmount.toString(),
          }
        }
      )

      //Event objects for "OrderFulfilled"
      const parsedOrderFulfilledLogs = orderFulfilledLogs.map((log) => {
        const decodedLog = hotpotContract.interface.parseLog(log)
        return {
          event: 'OrderFulfilled',
          offerer: decodedLog.args.offerer,
          buyer: decodedLog.args.buyer,
          offerToken: decodedLog.args.offerToken,
          tokenId: decodedLog.args.tokenId.toString(),
          tradeAmount: decodedLog.args.tradeAmount.toString(),
          orderHash: decodedLog.args.orderHash,
        }
      })

      const combinedData = {
        tickets: parsedGenerateRaffleTicketsLogs[0],
        order: parsedOrderFulfilledLogs[0],
      }

      return combinedData
    }
  } catch (err) {
    console.error('Error:', err)
  }

  return null
}

export default getTransactionData
