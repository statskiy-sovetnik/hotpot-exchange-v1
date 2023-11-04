import React from 'react'
import { FiCopy } from 'react-icons/fi'

interface CopyClipboardProps {
  content: string
}

const CopyClipboard: React.FC<CopyClipboardProps> = ({ content }) => {
  return (
    <FiCopy
      className="w-4 h-4 hover:cursor-pointer hover:text-neutral-700 focus:text-neutral-700 active:translate-y-1"
      onClick={() => navigator.clipboard.writeText(content)}
    />
  )
}

export default CopyClipboard
