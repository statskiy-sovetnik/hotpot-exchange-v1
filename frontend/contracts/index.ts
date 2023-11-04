export const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'OperatorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tradeAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
    ],
    name: 'OrderFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_raffleAddress',
        type: 'address',
      },
    ],
    name: 'RaffleAddressSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_newTradeFee',
        type: 'uint16',
      },
    ],
    name: 'RaffleTradeFeeChanged',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address payable', name: 'offerer', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'offerToken', type: 'address' },
              {
                internalType: 'uint256',
                name: 'offerTokenId',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'offerAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            ],
            internalType: 'struct IOrderFulfiller.OfferItem',
            name: 'offerItem',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'royaltyPercent',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'royaltyRecipient',
                type: 'address',
              },
            ],
            internalType: 'struct IOrderFulfiller.RoyaltyData',
            name: 'royalty',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct IOrderFulfiller.PureOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address payable', name: 'offerer', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'offerToken', type: 'address' },
              {
                internalType: 'uint256',
                name: 'offerTokenId',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'offerAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            ],
            internalType: 'struct IOrderFulfiller.OfferItem',
            name: 'offerItem',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'royaltyPercent',
                type: 'uint256',
              },
              {
                internalType: 'address',
                name: 'royaltyRecipient',
                type: 'address',
              },
            ],
            internalType: 'struct IOrderFulfiller.RoyaltyData',
            name: 'royalty',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'offererPendingAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'buyerPendingAmount',
                type: 'uint256',
              },
              { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
            ],
            internalType: 'struct IOrderFulfiller.PendingAmountData',
            name: 'pendingAmountsData',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'bytes', name: 'orderSignature', type: 'bytes' },
          {
            internalType: 'bytes',
            name: 'pendingAmountsSignature',
            type: 'bytes',
          },
        ],
        internalType: 'struct IOrderFulfiller.OrderParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'fulfillOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_raffleTradeFee', type: 'uint16' },
      { internalType: 'address', name: '_operator', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'operator',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleContract',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleTradeFee',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_newOperator', type: 'address' },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_raffleAddress', type: 'address' },
    ],
    name: 'setRaffleAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_newTradeFee', type: 'uint16' }],
    name: 'setRaffleTradeFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const ERC721abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const hotpotAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_link',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vrfV2Wrapper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Claim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_buyerTicketIdStart',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_buyerTicketIdEnd',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_sellerTicketIdStart',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_sellerTicketIdEnd',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_buyerPendingAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_sellerPendingAmount',
        type: 'uint256',
      },
    ],
    name: 'GenerateRaffleTickets',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newMarketplace',
        type: 'address',
      },
    ],
    name: 'MarketplaceUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'OperatorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'fromTicketId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'toTicketId',
        type: 'uint32',
      },
    ],
    name: 'RandomWordRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'potId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'randomWord',
        type: 'uint256',
      },
    ],
    name: 'RandomnessFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: '_winners',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint128[]',
        name: '_amounts',
        type: 'uint128[]',
      },
    ],
    name: 'WinnersAssigned',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'chainlinkRequests',
    outputs: [
      {
        internalType: 'bool',
        name: 'fullfilled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'randomWord',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'claimablePrizes',
    outputs: [
      {
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'deadline',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPotId',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPotSize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_winners',
        type: 'address[]',
      },
      {
        internalType: 'uint128[]',
        name: '_amounts',
        type: 'uint128[]',
      },
    ],
    name: 'executeRaffle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountInWei',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_buyerPendingAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_sellerPendingAmount',
        type: 'uint256',
      },
    ],
    name: 'executeTrade',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_potId',
        type: 'uint16',
      },
    ],
    name: 'getWinningTicketIds',
    outputs: [
      {
        internalType: 'uint32[]',
        name: '',
        type: 'uint32[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'potLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'raffleTicketCost',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'claimWindow',
            type: 'uint128',
          },
          {
            internalType: 'uint16',
            name: 'numberOfWinners',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'fee',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'tradeFee',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'marketplace',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        internalType: 'struct IHotpot.InitializeParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRaffleTicketId',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRequestId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextPotTicketIdStart',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberOfWinners',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potTicketIdEnd',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potTicketIdStart',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleTicketCost',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_requestId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_randomWords',
        type: 'uint256[]',
      },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'requestIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newMarketplace',
        type: 'address',
      },
    ],
    name: 'setMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newPotLimit',
        type: 'uint256',
      },
    ],
    name: 'setPotLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newRaffleTicketCost',
        type: 'uint256',
      },
    ],
    name: 'setRaffleTicketCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tradeFee',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'winningTicketIds',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const MARKET_ABI_G = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'OperatorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'offerer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'offerToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tradeAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
    ],
    name: 'OrderFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_raffleAddress',
        type: 'address',
      },
    ],
    name: 'RaffleAddressSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_newTradeFee',
        type: 'uint16',
      },
    ],
    name: 'RaffleTradeFeeChanged',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address payable', name: 'offerer', type: 'address' },
          { internalType: 'uint16', name: 'offererIndex', type: 'uint16' },
          {
            components: [
              { internalType: 'address', name: 'offerToken', type: 'address' },
              {
                internalType: 'uint256',
                name: 'offerTokenId',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'offerAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            ],
            internalType: 'struct IOrderFulfiller.OfferItem',
            name: 'offerItem',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'royaltyPercent',
                type: 'uint256',
              },
              {
                internalType: 'address payable',
                name: 'royaltyRecipient',
                type: 'address',
              },
            ],
            internalType: 'struct IOrderFulfiller.RoyaltyData',
            name: 'royalty',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'offererPendingAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'buyerPendingAmount',
                type: 'uint256',
              },
              { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
            ],
            internalType: 'struct IOrderFulfiller.PendingAmountData',
            name: 'pendingAmountsData',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'bytes', name: 'orderSignature', type: 'bytes' },
          {
            internalType: 'bytes',
            name: 'pendingAmountsSignature',
            type: 'bytes',
          },
          {
            internalType: 'enum IOrderFulfiller.OfferTokenType',
            name: 'tokenType',
            type: 'uint8',
          },
        ],
        internalType: 'struct IOrderFulfiller.BatchOrderParameters[]',
        name: 'parameters',
        type: 'tuple[]',
      },
      { internalType: 'address[]', name: 'offerers', type: 'address[]' },
    ],
    name: 'batchFulfillOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address payable', name: 'offerer', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'offerToken', type: 'address' },
              {
                internalType: 'uint256',
                name: 'offerTokenId',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'offerAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            ],
            internalType: 'struct IOrderFulfiller.OfferItem',
            name: 'offerItem',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'royaltyPercent',
                type: 'uint256',
              },
              {
                internalType: 'address payable',
                name: 'royaltyRecipient',
                type: 'address',
              },
            ],
            internalType: 'struct IOrderFulfiller.RoyaltyData',
            name: 'royalty',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
        ],
        internalType: 'struct IOrderFulfiller.PureOrder',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address payable', name: 'offerer', type: 'address' },
          {
            components: [
              { internalType: 'address', name: 'offerToken', type: 'address' },
              {
                internalType: 'uint256',
                name: 'offerTokenId',
                type: 'uint256',
              },
              { internalType: 'uint256', name: 'offerAmount', type: 'uint256' },
              { internalType: 'uint256', name: 'endTime', type: 'uint256' },
            ],
            internalType: 'struct IOrderFulfiller.OfferItem',
            name: 'offerItem',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'royaltyPercent',
                type: 'uint256',
              },
              {
                internalType: 'address payable',
                name: 'royaltyRecipient',
                type: 'address',
              },
            ],
            internalType: 'struct IOrderFulfiller.RoyaltyData',
            name: 'royalty',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'offererPendingAmount',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'buyerPendingAmount',
                type: 'uint256',
              },
              { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
            ],
            internalType: 'struct IOrderFulfiller.PendingAmountData',
            name: 'pendingAmountsData',
            type: 'tuple',
          },
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'bytes', name: 'orderSignature', type: 'bytes' },
          {
            internalType: 'bytes',
            name: 'pendingAmountsSignature',
            type: 'bytes',
          },
          {
            internalType: 'enum IOrderFulfiller.OfferTokenType',
            name: 'tokenType',
            type: 'uint8',
          },
        ],
        internalType: 'struct IOrderFulfiller.OrderParameters',
        name: 'parameters',
        type: 'tuple',
      },
    ],
    name: 'fulfillOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint16', name: '_raffleTradeFee', type: 'uint16' },
      { internalType: 'address', name: '_operator', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'operator',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'orderStatus',
    outputs: [
      { internalType: 'bool', name: 'isFulfilled', type: 'bool' },
      { internalType: 'bool', name: 'isCancelled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleContract',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleTradeFee',
    outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_newOperator', type: 'address' },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_raffleAddress', type: 'address' },
    ],
    name: 'setRaffleAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint16', name: '_newTradeFee', type: 'uint16' }],
    name: 'setRaffleTradeFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
export const HOTPOT_ABI_G = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_link',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vrfV2Wrapper',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Claim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_buyerTicketIdStart',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_buyerTicketIdEnd',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_sellerTicketIdStart',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: '_sellerTicketIdEnd',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_buyerPendingAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_sellerPendingAmount',
        type: 'uint256',
      },
    ],
    name: 'GenerateRaffleTickets',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newMarketplace',
        type: 'address',
      },
    ],
    name: 'MarketplaceUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_nOfWinners',
        type: 'uint16',
      },
    ],
    name: 'NumberOfWinnersUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'OperatorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint128[]',
        name: '_newPrizeAmounts',
        type: 'uint128[]',
      },
    ],
    name: 'PrizeAmountsUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'fromTicketId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'toTicketId',
        type: 'uint32',
      },
    ],
    name: 'RandomWordRequested',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'potId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'randomWord',
        type: 'uint256',
      },
    ],
    name: 'RandomnessFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: '_winners',
        type: 'address[]',
      },
    ],
    name: 'WinnersAssigned',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'canClaim',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'chainlinkRequests',
    outputs: [
      {
        internalType: 'bool',
        name: 'fullfilled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'randomWord',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'claimablePrizes',
    outputs: [
      {
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'deadline',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPotId',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPotSize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_winners',
        type: 'address[]',
      },
    ],
    name: 'executeRaffle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountInWei',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_buyerPendingAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_sellerPendingAmount',
        type: 'uint256',
      },
    ],
    name: 'executeTrade',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_potId',
        type: 'uint16',
      },
    ],
    name: 'getWinningTicketIds',
    outputs: [
      {
        internalType: 'uint32[]',
        name: '',
        type: 'uint32[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'potLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'raffleTicketCost',
            type: 'uint256',
          },
          {
            internalType: 'uint128',
            name: 'claimWindow',
            type: 'uint128',
          },
          {
            internalType: 'uint16',
            name: 'numberOfWinners',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'fee',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'tradeFee',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'marketplace',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        internalType: 'struct IHotpot.InitializeParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRaffleTicketId',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastRequestId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'marketplace',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextPotTicketIdStart',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberOfWinners',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'operator',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potTicketIdEnd',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'potTicketIdStart',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    name: 'prizeAmounts',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'raffleTicketCost',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_requestId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: '_randomWords',
        type: 'uint256[]',
      },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'requestIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newMarketplace',
        type: 'address',
      },
    ],
    name: 'setMarketplace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOperator',
        type: 'address',
      },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newPotLimit',
        type: 'uint256',
      },
    ],
    name: 'setPotLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newRaffleTicketCost',
        type: 'uint256',
      },
    ],
    name: 'setRaffleTicketCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_newTradeFee',
        type: 'uint16',
      },
    ],
    name: 'setTradeFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tradeFee',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_nOfWinners',
        type: 'uint16',
      },
    ],
    name: 'updateNumberOfWinners',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128[]',
        name: '_newPrizeAmounts',
        type: 'uint128[]',
      },
    ],
    name: 'updatePrizeAmounts',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'winningTicketIds',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
export const NFTMarketplace_CONTRACT_SEP =
  '0x4650fE604E42A403494Bf3190611d29419C91602'

export const Hotpot_CONTRACT_SEP = '0x50719273fb5878FE3370d4B3916a3425417f4B54'

export const MARKET_CONTRACT_G = '0x8C9f63DFe33f6384f1578Aef61770772b7bDF432'

export const HOTPOT_CONTRACT_G = '0x375248CdAe8c3D1ac9C49eA1454281c913919583'
