import React from 'react'

const FileList = ({fileList}) => {
    return (
        <div>
            {fileList.map((file, index) => (
                <li key={index}>{file}</li>
            ))}
        </div>
    )
}

export default FileList