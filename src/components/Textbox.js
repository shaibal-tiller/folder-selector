import React from 'react'

const Textbox = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <textarea
        className="w-full h-full p-2 border-2 border-gray-300 shadow-inner resize-none"
        placeholder="Enter text here..."
      ></textarea>
    </div>
  )
}

export default Textbox
