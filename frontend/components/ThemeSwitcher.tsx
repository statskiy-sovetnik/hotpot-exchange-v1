import { useTheme } from 'next-themes'
import { FiMoon, FiSun } from 'react-icons/fi'
import React, { useState, useEffect } from 'react'

const THEME_SWITCHING_ENABLED = process.env.NEXT_PUBLIC_THEME_SWITCHING_ENABLED
const DARK_MODE_ENABLED = process.env.NEXT_PUBLIC_DARK_MODE

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const defaultTheme = DARK_MODE_ENABLED ? 'dark' : 'light'
  const [isOn, setIsOn] = useState(theme === defaultTheme)

  const toggleSwitch = () => {
    setIsOn(!isOn)
    if (isOn) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsOn(theme === 'dark')
  }, [theme])

  if (!mounted) {
    return null
  }

  return (
    <div
      onClick={toggleSwitch}
      className={`flex  min-w-[90px]  overflow-hidden rounded-full border-[#D1D5DB] bg-[#F6F6F6] p-1  dark:bg-neutral-800 ${
        isOn && 'place-content-end '
      }`}
    >
      <div className="flex w-1/2 items-center justify-center rounded-[32px] bg-[#FCFCFC] p-3 shadow-md  ease-in-out dark:bg-neutral-700">
        {isOn ? (
          <div>
            <FiMoon className="flex-auto text-slate-200" />
          </div>
        ) : (
          <div className="">
            <FiSun className="flex-auto text-neutral-800" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemeSwitcher
