import { FaTwitter, FaDiscord } from 'react-icons/fa'
import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'

const Footer = () => {
  return (
    <footer className="flex flex-row items-center justify-between px-6 py-2 mt-12 border-t col-span-full dark:border-t-neutral-600 md:mt-12 md:px-16">
      <div className="flex flex-row flex-wrap items-center justify-between text-xs gap-x-2 sm:mb-0 sm:gap-x-4 sm:text-sm">
        <Link href="/" legacyBehavior={true}>
          <img src="/hotpot.png" alt="hotpot-logo" className="w-8 h-8" />
        </Link>
        <div className="py-2 text-center text-xs text-[#98A2B3]">
          ©2023 Hotpot Inc.
        </div>
      </div>

      <div className="flex flex-row items-center gap-x-4 md:gap-x-6">
        <Link
          href="https://discord.com/invite/R7pS7XY9h3"
          className="ml-5"
          legacyBehavior={true}
        >
          <a
            href="https://discord.com/invite/R7pS7XY9h3"
            className="transition hover:translate-y-[-2px]"
            target="_blank"
            rel="noreferrer"
          >
            <FaDiscord className="h-[19px] w-[25px] text-[#620DED]" />
          </a>
        </Link>
        <Link href="https://twitter.com/hotpot_gg" legacyBehavior={true}>
          <a
            href="https://twitter.com/hotpot_gg "
            className="transition hover:translate-y-[-2px]"
            target="_blank"
            rel="noreferrer"
          >
            <FaTwitter className="h-[20px] w-[25px] text-[#620DED]" />
          </a>
        </Link>
      </div>
      <div className="hidden md:block">
        <ThemeSwitcher />
      </div>
    </footer>
  )
}

export default Footer
