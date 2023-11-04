import React from 'react'

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const ButtonGradient = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, onClick, className }, ref) => {
    return (
      <button
        onClick={onClick}
        ref={ref}
        className={`font-base group reservoir-h1 relative  inline-flex items-center justify-center overflow-hidden rounded-[8px] bg-gradient-to-l from-[#EE00BA] via-[#6100FF] to-[#FF3D00E5] p-[1px] text-sm font-medium text-gray-900 hover:from-[#620DED] hover:to-[#620DED] hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800 ${className}`}
      >
        <span className="relative rounded-[7px] bg-white px-4 py-2 group-hover:bg-opacity-0 group-hover:text-white dark:bg-gray-900">
          {children}
        </span>
      </button>
    )
  }
)

export default ButtonGradient
