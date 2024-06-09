import React, { useState } from 'react'
import Base from './Base'
import Textbox from './Textbox'
import NameDisplay from './NameDisplay'
import ActionButtons from './ActionButtons'
const TrafficVideoSelector = () => {
    const [folder, setFolder] = useState(null)
    const [files, setFiles] = useState(null)
    const [isOpen, setOpen] =useState(false)
    const handleReset = () => {
        setOpen(false)
        setFolder(null)
        setFiles(null)
    }
    return (
        <div className="h-full w-full  grid grid-cols-12 gap-4 p-[2vh]  lg:px-[10%]">
            <div className="col-span-8 bg-white shadow-md h-[77vh] p-4">
                <Base directorySetter={setFolder} files={files} setFiles={setFiles} />
            </div>
            <div className="col-span-4  bg-gray-200 shadow-md h-[77vh] p-4">
                <Textbox />
            </div>
            <div className="col-span-8 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
                <NameDisplay folder={folder} isOpen={isOpen} setOpen={setOpen} />
            </div>
            <div className="col-span-4  bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
                <ActionButtons handleReset={handleReset} />
            </div>
        </div>
    )
}


export default TrafficVideoSelector