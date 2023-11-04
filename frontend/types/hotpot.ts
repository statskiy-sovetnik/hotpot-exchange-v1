export type HotpotListing = {
  total_price: number
  order_hash: string
  offerer: string
  offer_token: string
  offer_token_id: number
  offer_amount: string
  end_time: number
  royalty_percent: number
  royalty_recipient: string
  salt: number
  order_signature: string
  pending_amount_signature: string
}

export interface OrderParameters {
  offerer: string
  offerItem: OfferItem
  royalty: RoyaltyData
  pendingAmountsData: PendingAmountData
  salt: number
  orderSignature: string
  pendingAmountsSignature: string
}

interface OfferItem {
  offerToken: string
  offerTokenId: number
  offerAmount: number
  endTime: number
}

interface RoyaltyData {
  royaltyPercent: number
  royaltyRecipient: string
}

interface PendingAmountData {
  offererPendingAmount: string
  buyerPendingAmount: string
  orderHash: string
}
