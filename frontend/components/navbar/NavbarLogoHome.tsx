import useEnvChain from 'hooks/useEnvChain'
import Link from 'next/link'
import { FC } from 'react'

type Props = {
  variant?: 'desktop' | 'mobile' | undefined
  className?: string
}

const NavbarLogoHome: FC<Props> = ({ variant, className }) => {
  const logo = '/hotpot.png'
  const desktopLogo = '/new/hotpot-light.svg'
  const logoAlt = 'Logo'

  const mobileVariant = variant === 'mobile'
  const desktopVariant = variant === 'desktop'

  return (
    <Link href="/" legacyBehavior={true}>
      <a
        className={`relative inline-flex flex-none items-center gap-1 ${className}`}
      >
        <img
          src={logo}
          alt={logoAlt}
          className={`z-10 h-9 w-auto ${!variant ? 'md:hidden' : ''} ${
            desktopVariant ? 'hidden' : ''
          } ${mobileVariant ? 'block' : ''}`}
        />
        <img
          src={desktopLogo}
          alt={logoAlt}
          className={`h-9 w-auto md:block ${
            !variant ? 'hidden md:block' : ''
          } ${mobileVariant ? 'hidden' : ''} ${desktopVariant ? 'block' : ''}`}
        />{' '}
        <div className="flex flex-col items-start justify-start md:hidden">
          <span className="rounded border border-white px-1.5 py-0.5 text-[8px] text-white">
            BETA
          </span>
        </div>
        <span
          className="absolute top-0 right-0 hidden rounded border border-white px-1.5 py-0.5 text-[8px] text-white md:block"
          style={{ transform: 'translate(60%, -60%)' }}
        >
          BETA
        </span>
      </a>
    </Link>
  )
}

export default NavbarLogoHome
