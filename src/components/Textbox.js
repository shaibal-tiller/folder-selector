import React from 'react';
import '../styles/directory.css';

const Textbox = ({ rectangle_markers, setRectangleMarkers }) => {
  const handleRemove = (indexToRemove) => {
    const updatedMarkers = rectangle_markers.filter((_, index) => index !== indexToRemove);
    setRectangleMarkers(updatedMarkers);
  };

  const handleCopy = (coordinates) => {
    const coordString = coordinates.map(entry => `${entry.x.toFixed(3)}, ${entry.y.toFixed(3)}`).join('\n');
    navigator.clipboard.writeText(coordString).then(() => {
      // alert('Coordinates copied to clipboard');
      console.log('Coordinates copied to clipboard');
    }, (err) => {
      console.error('Failed to copy coordinates:', err);
    });
  };

  return (
    <ul className="rectangle-list">
      {rectangle_markers?.slice().reverse().map((marker, index) => {
        const markerIndex = rectangle_markers.length - index - 1;
        return (
          <li key={markerIndex} className="rectangle-item whitespace-pre relative group">
            {Object.keys(marker)?.length ? `Rectangle-${markerIndex + 1}:` : ""}
            <ul className='pl-2 text-xs flex justify-start items-start w-full flex-wrap'>
              {Object.values(marker)?.map((entry, ind) => {
                return `${entry?.x.toFixed(3)} , ${entry?.y.toFixed(3)}${ind % 2 !== 1 ? ' ,' : ""}`
              })?.map((el, ind) => (
                <p key={ind} className={`${ind % 2 !== 1 ? 'text-green-500 text-end' : "text-red-500 text-start"} w-1/2`}>
                  {` ${el}`}
                </p>
              ))}
            </ul>
            <div className="absolute right-0 top-0 hidden group-hover:flex space-x-2">
              <button
                onClick={() => handleCopy(Object.values(marker))}
                className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
              >
                Copy
              </button>
              <button
                onClick={() => handleRemove(markerIndex)}
                className="bg-red-500 text-white px-2 py-1 text-xs rounded"
              >
                Remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default Textbox;
