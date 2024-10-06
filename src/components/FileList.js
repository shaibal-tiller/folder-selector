import React from 'react'

const FileList = ({fileList}) => {
    return (
        <div className='px-6 py-4 '>
            <h2 className='text-lg font-semibold'>File List</h2>
            {fileList.map((file, index) => (
                <li key={index}>{file}</li>
            ))}
        </div>
    )
}

export default FileList