import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import usePrizePool from 'hooks/usePrizePool'
import { CgSpinnerAlt } from 'react-icons/cg'
import useIsDrawing from 'hooks/useIsDrawing'
import { useTheme } from 'next-themes'
import useRafflePotId from 'hooks/useRafflePotId'
import useMounted from 'hooks/useMounted'

const PrizePoolWidget: React.FC = () => {
  const { data: prizePool } = usePrizePool()
  const { data: isDrawing } = useIsDrawing()
  const { data: rafflePotId } = useRafflePotId()
  const { theme } = useTheme()
  const isMounted = useMounted()
  if (!isMounted) {
    return null
  }
  // Calculate Current pot id using rafflePotId + 1
  const potId = rafflePotId && rafflePotId.pot_id + 1

  //Color
  const trailColor = theme === 'dark' ? '#FFF' : '#1D1D1D'
  const pathColor = theme === 'dark' ? '#9379FB' : '#CABDFF'

  return (
    <div className=" flex  w-full flex-col items-center justify-between gap-2 rounded-[20px]  bg-white p-4 dark:bg-[#1D1D1D] md:max-w-[481px]">
      <div className="flex justify-start w-full items-left ">
        <h1 className="z-5 rounded text-base font-semibold text-[#1A1D1F] backdrop-blur-sm dark:text-white">
          Prize Pool #{rafflePotId && potId}
        </h1>
      </div>

      {/* Circular Progress Bar */}
      <div className="relative flex items-center justify-center px-10 rounded-full md:px-30 group w-fit">
        <CircularProgressbarWithChildren
          className="group relative  w-[228px] rounded-full  p-0 md:w-[228px] lg:w-[228px]"
          value={Number(prizePool?.currentPotSize) || 0}
          maxValue={Number(prizePool?.potLimit) || 100}
          strokeWidth={10}
          backgroundPadding={8}
          styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0.5,

            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'round',

            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 1.5,

            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',

            // Colors

            pathColor: pathColor,
            trailColor: trailColor,
            textColor: '#f88',
            backgroundColor: '#00000',
          })}
        >
          {/* Pot Size Card Hover */}
          {prizePool && !isDrawing && (
            <div className=" absolute left-[-30px] top-[30px] transform-gpu  opacity-0 transition-opacity duration-100 group-hover:opacity-100 md:left-[-100px] ">
              <div className="flex flex-col justify-start gap-2 p-2 bg-white rounded-lg shadow-md items-left">
                <div className="flex flex-row text-xs text-neutral-600 md:text-sm">
                  Pot Size
                </div>

                <div className="flex flex-row items-center justify-center w-full text-xs font-bold text-gray-800 md:text-sm">
                  <img src="/eth.svg" className="w-4 h-4 mr-1 " />
                  {prizePool?.currentPotSize?.slice(0, 5)}/
                  {prizePool?.potLimit?.slice(0, 5)} ETH
                </div>
              </div>
            </div>
          )}
          {isDrawing ? (
            <>
              <CgSpinnerAlt className="absolute h-screen w-[310px] animate-spin  text-violet-800 transition" />
              <div className="z-10 flex h-[230px] w-[230px]  flex-col items-center justify-center rounded-full bg-neutral-100 shadow-xl transition-all delay-100 dark:bg-neutral-900">
                <span className=" reservoir-h1 animate-pulse border-b border-neutral-300 pb-2 text-center text-[16px] font-bold text-violet-700 dark:border-neutral-700 dark:text-violet-700  md:text-[18px]">
                  Drawing Winner...
                </span>
                {prizePool ? (
                  <h1 className=" text-center text-[24px] font-bold  text-[#1D1D1D] dark:text-white md:text-[30px]">
                    {prizePool?.potLimit?.slice(0, 5)} ETH
                  </h1>
                ) : null}
              </div>
            </>
          ) : prizePool && !isDrawing ? (
            <div className="flex flex-col items-center justify-center gap-2 px-5 text-center">
              <span className="reservoir-h1 text-center text-[12px] font-medium text-[#272B30] lg:text-sm">
                Current Pot Size
              </span>
              <h1 className="group relative text-[24px] font-semibold  text-[#272B30] dark:text-white lg:text-[30px] ">
                {prizePool.currentPotSize.slice(0, 5)} ETH
              </h1>
            </div>
          ) : (
            !prizePool &&
            !isDrawing && (
              <div className="flex flex-col gap-2 ">
                <span className="reservoir-h1 text-center text-[12px] font-medium text-[#272B30] lg:text-sm">
                  Current Pot Size
                </span>
                <h1 className="group relative text-[24px] font-semibold text-transparent text-[#272B30] dark:text-white lg:text-[30px] ">
                  0.00 ETH
                </h1>
              </div>
            )
          )}
        </CircularProgressbarWithChildren>
      </div>
      {/* Circular Progress Bar --END */}
      <div className="z-5 flex w-full flex-row justify-between text-[12px] font-semibold text-[#1D1D1D] dark:text-white">
        <div className="flex flex-row items-center gap-2 rounded backdrop-blur-sm">
          <div className="h-4 w-4 rounded bg-[#CABDFF]  dark:bg-[#9379FB]" />
          <h6>Current Pot Size</h6>
        </div>
        <div className="flex flex-row items-center gap-2 rounded backdrop-blur-sm">
          <div className="h-4 w-4 rounded bg-[#1D1D1D] dark:bg-[#FFF]" />
          <h6>Total Pot Size</h6>
        </div>
      </div>
    </div>
  )
}

export default PrizePoolWidget
