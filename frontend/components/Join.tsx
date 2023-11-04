import Link from 'next/link'

const Join = () => {
  return (
    <div className="mt-[100px] w-full rounded-lg bg-[#620DED]">
      <div className="flex flex-col justify-between gap-4 px-2 py-8 md:flex-row md:p-16">
        <div className="flex flex-col items-center gap-2 text-white md:items-start">
          <h1 className="text-3xl font-semibold"> Join the Raffle Draw</h1>
          <p className="text-base font-normal ">
            Learn how you can win up to 1 ETH
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link href="/how-it-works" legacyBehavior={true}>
            <a href="/how-it-works">
              <button
                id="secondary CTA"
                className="pointer-cursor flex transform items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-105 hover:text-neutral-900 hover:shadow-lg md:rounded-lg md:py-3 md:px-5 md:text-base"
              >
                See How it Works
              </button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Join
