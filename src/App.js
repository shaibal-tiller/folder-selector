import React, { useState } from 'react'
import './App.css'
import Base from './components/Base'
import Textbox from './components/Textbox'
import NameDisplay from './components/NameDisplay'
import ActionButtons from './components/ActionButtons'
import TrafficVideoSelector from './components/TrafficVideoSelector'

function App() {



  return (
    <div className="App h-screen w-screen overflow-hidden ">
      <TrafficVideoSelector />
    </div>
  )
}

export default App
