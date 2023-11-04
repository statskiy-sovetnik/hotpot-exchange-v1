import { useTokens } from '@reservoir0x/reservoir-kit-ui'
import { atom } from 'recoil'
import { HotpotListing } from 'types/hotpot'

type UseTokensReturnType = ReturnType<typeof useTokens>

export type Token = {
  token: NonNullable<
    NonNullable<NonNullable<UseTokensReturnType['data']>[0]>['token']
  >
  market: NonNullable<
    NonNullable<NonNullable<UseTokensReturnType['data']>[0]>['market']
  >
  hotpotListing: HotpotListing
  tix: number
  url: string
}

export default atom<Token[]>({
  key: 'cartTokens',
  default: [],
})
