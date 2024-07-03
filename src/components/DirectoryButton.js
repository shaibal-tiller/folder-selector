import React from 'react';

function DirectoryButton({ handleClick }) {
  
  
    return (
        <button
            className="px-2 py-1 bg-light-2 bg-opacity-30 rounded-md text-light-2 text-lg hover:shadow-md hover:scale-105 active:scale-95"
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(); }}
        >
            Open directory
        </button>

    );
}

export default DirectoryButton;
