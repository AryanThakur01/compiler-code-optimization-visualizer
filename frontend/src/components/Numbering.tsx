import React from 'react'

interface NumberingProps {
  text: string
}

const Numbering: React.FC<NumberingProps> = ({ text }) => {
  const lines = text.split('\n')

  return (
    <div className="w-14 flex flex-col items-start gap-1 p-3 bg-gray-900 text-gray-500 border-r border-gray-700 rounded-l-lg">
      {lines.map((_, index) => (
        <span key={index} className="text-sm">
          {index + 1}
        </span>
      ))}
    </div>
  )
}

export default Numbering
