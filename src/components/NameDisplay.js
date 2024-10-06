import React, { useState } from 'react'
import FileList from './FileList'

const NameDisplay = ({ folder, isOpen, setOpen }) => {



    const {  folder_name, file_list, number_of_files } = folder || {}

    return (
        <div className="w-full h-full flex flex-col ">
            <div className='flex gap-x-2 items-center justify-start text-lg'>
                <h2 className="text-lg font-semibold">{"Folder Name:"}</h2>
                <p className=''>{folder_name}</p>
            </div>
         
            <div className='flex gap-x-2 items-center justify-start text-lg'>
                <h2 className="text-lg font-semibold">{"Number of Supported Files: "}</h2>
                <p>{number_of_files}</p>
                {/* {folder && <button onClick={() => setOpen(!isOpen)}
                    className='text-sm rounded-md bg-light-2 text-light-1 px-2 border-[1px] border-transparent hover:border-dark-1 '>{isOpen ? 'Hide' : 'Show'} List</button>} */}
            </div>

            {/* {isOpen ? <ul className="absolute bg-light-1  left-4 top-8 list-disc pl-5 border-2 border-semiblack">
                <FileList fileList={file_list||[]} />
            </ul> : <></>} */}

        </div>
    )
}

export default NameDisplay
