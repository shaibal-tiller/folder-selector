import React from 'react'

const MainBase = ({setThumbnailProperties,imageSize,imageUrl}) => {
    return (
        <img
            onLoad={(event) => {
                setThumbnailProperties({
                    width: event.target.naturalWidth,
                    height: event.target.naturalHeight,
                    size: imageSize // Use imageSize from usePreview hook
                });
            }}
            onError={(error) => {
                console.log(error);
            }}
            className='w-full h-full object-contain border-2'
            src={imageUrl}
        />
    )
}

export default MainBase