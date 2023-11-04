import useEnvChain from 'hooks/useEnvChain'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
  variant?: 'desktop' | 'mobile' | undefined
  className?: string
}

const NavbarLogo: FC<Props> = ({ variant, className }) => {
  const logo = '/hotpot.png'
  const desktopLogo = '/purple-hotpot.svg'
  const desktopLight = '/new/hotpot-light.svg'
  const logoAlt = 'Logo'

  const mobileVariant = variant === 'mobile'
  const desktopVariant = variant === 'desktop'

  return (
    <Link href="/" legacyBehavior={true}>
      <a
        className={`relative inline-flex flex-none items-center gap-1 ${className}`}
        style={{ position: 'relative' }}
      >
        <img
          src={logo}
          alt={logoAlt}
          className={`h-9 w-auto ${!variant ? 'md:hidden' : ''} ${
            desktopVariant ? 'hidden' : ''
          } ${mobileVariant ? 'block' : ''}`}
        />
        <img
          src={desktopLogo}
          alt={logoAlt}
          className={`h-9 w-auto dark:hidden md:block ${
            !variant ? 'hidden md:block' : ''
          } ${mobileVariant ? 'hidden' : 'dark:hidden'} ${
            desktopVariant ? 'block dark:hidden' : ''
          }`}
        />

        <img
          src={desktopLight}
          alt={logoAlt}
          className={`h-9 w-auto dark:md:block ${!variant ? 'hidden' : ''} ${
            mobileVariant ? 'hidden dark:md:block' : ''
          } ${desktopVariant ? 'hidden dark:block' : ''}`}
        />
        <div className="flex flex-col items-start justify-start md:hidden">
          <span className="rounded border border-violet-700 px-1.5 py-0.5 text-[8px] text-violet-700 dark:border-white dark:text-white">
            BETA
          </span>
        </div>
        <span
          className="absolute top-0 right-0 hidden rounded border border-violet-700 px-1.5 py-0.5 text-[8px] text-violet-700 text-violet-700 dark:border-white dark:text-white md:block"
          style={{ transform: 'translate(60%, -60%)' }}
        >
          BETA
        </span>
      </a>
    </Link>
  )
}

export default NavbarLogo
