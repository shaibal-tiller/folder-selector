import React from 'react'

const ActionButtons = () => {
  const handleClick = (message) => {
    alert(message)
  }

  return (
    <div className="w-full h-full flex items-center justify-around">
      <button
        className="bg-gray-600 bg-opacity-80 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
        onClick={() => handleClick('Button 1 clicked!')}
      >
        Button 1
      </button>
      <button
        className="bg-gray-600 bg-opacity-80 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
        onClick={() => handleClick('Button 2 clicked!')}
      >
        Button 2
      </button>
    </div>
  )
}

export default ActionButtons
