import { FC } from 'react'

type Props = {
  name: string | undefined
  avatar: string | undefined
}

const FeaturedCollection: FC<Props> = ({ name, avatar }) => {
  return (
    <>
      <div className="border-1 relative flex w-full rounded-2xl border-black bg-white p-2  dark:border-[#FAF9FE] dark:bg-black">
        <div className="">
          <img
            src={avatar}
            className="h-[180px] w-[320px] rounded-xl object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 rounded-br-[50%] bg-white p-2 dark:bg-black">
          <div className="relative">
            <img
              src="/new/edge.svg"
              alt="edge"
              className="absolute -right-[19px] h-[11px] w-[11px] dark:hidden"
            />
            <img
              src="/new/edge.svg"
              alt="edge"
              className="absolute -bottom-[19px] h-[11px] w-[11px] dark:hidden"
            />
            <img src="/hotpot.png" className="w-[44px]" />
            <div className="absolute"></div>
          </div>
        </div>
        <div className="absolute left-4 bottom-4 flex h-8 max-w-[85%] items-center justify-center gap-2 overflow-hidden rounded-full border border-white bg-black/[.25] py-0.5 px-4 text-xs font-medium text-white shadow-md backdrop-blur">
          <p className="truncate">{name}</p>
        </div>
      </div>
    </>
  )
}

export default FeaturedCollection
