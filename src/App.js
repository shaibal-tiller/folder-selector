import React from 'react'
import './App.css'
import Base from './components/Base'
import Textbox from './components/Textbox'
import NameDisplay from './components/NameDisplay'
import ActionButtons from './components/ActionButtons'

function App() {

  
  return (
    <div className="App h-screen w-screen overflow-hidden grid grid-cols-12 gap-4 p-[2vh] bg-gray-100 lg:px-[10%]">
      <div className="col-span-8 bg-white shadow-md h-[77vh] p-4">
        <Base />
      </div>
      <div className="col-span-4  bg-gray-200 shadow-md h-[77vh] p-4">
        <Textbox />
      </div>
      <div className="col-span-8 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
        <NameDisplay folder="Folder1" fileList={['file1.txt', 'file2.txt']} />
      </div>
      <div className="col-span-4  bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
        <ActionButtons />
      </div>
    </div>
  )
}

export default App
