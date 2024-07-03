import React from 'react';
import Loading from './Loading.js';

function FilePreview({ files,  thumbnailProperties,  }) {
    return (
        <div className='absolute bottom-0 right-0 bg-gray-800 bg-opacity-50 text-white p-2 rounded-tl-md text-sm'>
            <p>Video File Name: {files[0].name}</p>
            <p>Image File Size: {((thumbnailProperties.size || 0) / 1000 / 1000).toFixed(2)} MB</p>
            <p>Image Frame Resolution: {thumbnailProperties.width}x{thumbnailProperties.height}</p>
        </div>
    );
}

export default FilePreview;
