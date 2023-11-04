import usePrizePool from 'hooks/usePrizePool'
import useTicketCost from 'hooks/useTicketCost'

type HeroProps = {
  variant?: string
}

const Hero: React.FC<HeroProps> = ({ variant }) => {
  const { data: prizePool } = usePrizePool()
  const { data: ticketCost } = useTicketCost()
  const currentPotSize = parseFloat(prizePool?.currentPotSize ?? '0')
  const potLimit = parseFloat(prizePool?.potLimit ?? '0')
  const potFill = Math.round((currentPotSize / potLimit) * 100)
  const backgroundImageUrl =
    variant === 'rewards' ? '/banner-rewards.svg' : '/banner-home.svg'
  const bottomImageUrl =
    variant === 'rewards' ? '/gold-pot.svg' : '/gold-chest.svg'
  const textColor = variant === 'rewards' ? 'text-white' : 'text-[#101828]'

  return (
    <div
      className="grid h-[32rem] w-full grid-cols-1 overflow-hidden rounded-xl bg-cover bg-center md:max-h-[26rem] md:grid-cols-2"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div>
        <div className="flex flex-col items-center justify-center px-2 py-10">
          <img src="/pot-o-gold.svg" alt="pot-o-gold" />
          <h2
            className={`mt-[-0.75rem] text-base font-normal ${textColor} px-4 md:text-lg`}
          >
            Earn 1 raffle ticket for every {ticketCost} ETH bought or sold
          </h2>
          <div className="flex flex-col items-center">
            <div className="mt-11 flex w-[340px] flex-col items-center justify-center rounded-t-xl  bg-[#EFEAFF] py-4 px-10 text-black md:gap-2 md:px-14">
              <div className="flex flex-row text-lg text-[#5440A3] md:text-xl ">
                The Prize Pool
              </div>
              <div className="w-full items-center text-center text-lg md:w-auto md:text-2xl">
                <div className="text-lg font-bold text-[#B0A5B9] md:text-2xl">
                  {prizePool?.currentPotSize?.slice(0, 5)}{' '}
                  <span className="text-md font-light md:text-xl">ETH</span> /{' '}
                  <span className="font-bold text-[#620DED]">
                    {prizePool?.potLimit?.slice(0, 4)}{' '}
                    <span className="text-md font-light md:text-xl">ETH</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full bg-white">
              {' '}
              <div
                className={`transition-width w-full bg-gradient-to-r from-[#FBD85D]  to-[#FFDC22] py-2  text-center text-xs duration-500 ease-out`}
                style={{ width: potFill ? `${potFill}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-center md:hidden md:items-end">
            <img
              src={bottomImageUrl}
              alt="rewards-image"
              className="h-[16rem] object-fill md:h-[30rem] md:object-bottom"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center md:flex md:items-end">
        <img
          src={bottomImageUrl}
          alt="rewards-image"
          className="h-[16rem] object-fill md:h-[30rem] md:object-bottom"
        />
      </div>
    </div>
  )
}

export default Hero
