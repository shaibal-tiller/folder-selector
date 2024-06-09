import React from 'react'

const ActionButtons = ({ handleReset }) => {
  const handleClick = (message) => {
    alert(message)
  }

  return (
    <div className="w-full h-full flex items-center justify-around">
      <button
        className="bg-gray-600 bg-opacity-80 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
        onClick={() => handleClick('Button 2 clicked!')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="float-left pr-1 size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>



        Pause
      </button>
      <button
        className="bg-gray-600 bg-opacity-80 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
        onClick={() => handleClick('Button 1 clicked!')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="float-left pr-1 size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>

        Start
      </button>

      <button
        className="bg-gray-600 bg-opacity-80 text-white py-2 px-4 rounded shadow hover:bg-gray-700"
        onClick={handleReset}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="float-left pr-1 size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Reset
      </button>
    </div>
  )
}


export default ActionButtons
