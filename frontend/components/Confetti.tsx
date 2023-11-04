import React, { useState, useEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import useIsDrawing from 'hooks/useIsDrawing'

const ConfettiComponent = () => {
  const { data: isDrawn } = useIsDrawing()
  const [isConfettiActive, setConfettiActive] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (isDrawn) {
      setConfettiActive(true)

      const confettiTimeout = setTimeout(() => {
        setConfettiActive(false)
      }, 10000)

      return () => {
        clearTimeout(confettiTimeout)
      }
    }
  }, [isDrawn])

  return isConfettiActive ? <Confetti width={width} height={height} /> : null
}

export default ConfettiComponent
