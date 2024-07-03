import React, { useState } from 'react'
import './App.css'
import TrafficVideoSelector from './components/TrafficVideoSelector'
import WebSocket from './components/websocket'

function App() {



  return (
    <div className="App h-screen w-screen overflow-hidden ">
      <TrafficVideoSelector />
      <WebSocket />
    </div>
  )
}

export default App
