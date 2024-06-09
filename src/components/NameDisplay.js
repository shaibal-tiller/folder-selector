import React, { useState } from 'react'
import FileList from './FileList'

const NameDisplay = ({ folder, fileList }) => {
    const folder_name = `E:\\Folder\\`
    const [isOpen, setOpen] = useState(false)

    return (
        <div className="w-full h-full flex flex-col ">
            <div className='flex gap-x-2 items-center justify-start text-lg'>
                <h2 className="text-lg font-semibold">{"Folder Name:"}</h2>
                <p className=''>{folder_name}</p>
            </div>

            <div className='flex gap-x-2 items-center justify-start text-lg'>
                <h2 className="text-lg font-semibold">{"Number of Supported Files: "}</h2>
                <p>11</p>
                <button onClick={() => setOpen(!isOpen)}
                    className='text-sm rounded-md bg-light-2 text-light-1 px-2 border-[1px] border-transparent hover:border-dark-1 '>{isOpen ? 'Hide' : 'Show'} List</button>
            </div>

            {isOpen ? <ul className="list-disc pl-5">
                <FileList fileList={fileList} />
            </ul> : <></>}

        </div>
    )
}

export default NameDisplay
