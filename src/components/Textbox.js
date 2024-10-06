import React ,{useRef}from 'react';
import '../styles/directory.css';
let coordString = ''
const Textbox = ({ rectangle_markers, setRectangleMarkers }) => {



  const generateCoordinatesFile = () => {
    const blob = new Blob([coordString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coordinates.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const requestClipboardPermission = async () => {

    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' });

      if (permission.state === 'granted' || permission.state === 'prompt') {
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }

      permission.onchange = () => {
        setPermissionStatus(permission.state);
      };
    } catch (error) {
      generateCoordinatesFile()
      console.log(error);
      console.error('Failed to request clipboard permission', error);
    }
  };
  const handleRemove = (indexToRemove) => {
    const updatedMarkers = rectangle_markers.filter((_, index) => index !== indexToRemove);
    setRectangleMarkers(updatedMarkers);
  };

  const handleCopy = (e) => {
    e.preventDefault()
    coordString = ''





    rectangle_markers?.map(el => {
      Object.values(el)?.map((entry, index) => {
        coordString += `${entry.x.toFixed(3)}, ${entry.y.toFixed(3)}`

        coordString += (index % 2 == 0) ? "," : "\n"
      })
    })



    navigator?.clipboard?.writeText(coordString).then(() => {
      console.log('Coordinates copied to clipboard');
    }, (err) => {
      console.error('Failed to copy coordinates:', err);
    });
    requestClipboardPermission()
  };


  const fileInputRef = useRef(null);

  // Function to handle file selection and parse coordinates
  const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').filter(line => line.trim() !== '');

      const newMarkers = [];
      for (let i = 0; i < lines.length; i += 2) {
        const coords1 = lines[i].split(',').map(coord => parseFloat(coord.trim()));
        const coords2 = lines[i + 1]?.split(',').map(coord => parseFloat(coord.trim()));

        if (coords1.length === 4 && coords2.length === 4) {
          const marker = {
            p1: { x: coords1[0], y: coords1[1] },
            p2: { x: coords1[2], y: coords1[3] },
            p3: { x: coords2[0], y: coords2[1] },
            p4: { x: coords2[2], y: coords2[3] }
          };
          newMarkers.push(marker);
        }
      }

      console.log(newMarkers);
       // Check the format in the console
      setRectangleMarkers(newMarkers);
    };
    reader.readAsText(file);
  }
};


  // Function to open file selector
  const handleInsert = () => {
    fileInputRef.current.click();
  };

  return (
    <ul className="rectangle-list relative">
      <li className="sticky right-0 top-0 flex space-x-2 bg-slate-300 py-2 justify-center z-10">
        <button
          onClick={handleCopy}
          className="bg-blue-500 text-white py-1 text-xs rounded uppercase px-4 font-semibold tracking-widest active:scale-95"
        >
          Copy

        </button>

        <button
          onClick={handleInsert}
          className="bg-green-500 text-white py-1 text-xs rounded uppercase px-4 font-semibold tracking-widest active:scale-95"
        >
          Insert
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".txt"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />


        {/* <button
          onClick={() => handleRemove(markerIndex)}
          className="bg-red-500 text-white px-2 py-1 text-xs rounded"
        >
          Remove
        </button> */}

      </li>
      {rectangle_markers?.map((marker, index) => {
        const markerIndex = rectangle_markers.length - index - 1;
        return (
          <li key={markerIndex} className="rectangle-item whitespace-pre relative group">
            {/*    {Object.keys(marker)?.length ? `Rectangle-${markerIndex + 1}:` : ""} */}
            <ul className='pl-2 text-xs flex justify-start items-start w-full flex-wrap'>
              {Object.values(marker)?.map((entry, ind) => {
                return `${entry?.x.toFixed(3)} , ${entry?.y.toFixed(3)}${ind % 2 !== 1 ? ' ,' : ""}`
              })?.map((el, ind) => (
                <p key={ind} className={`${ind % 2 !== 1 ? 'text-green-500 text-end' : "text-red-500 text-start"} w-1/2`}>
                  {` ${el}`}
                </p>
              ))}
            </ul>

          </li>
        );
      })}
    </ul>
  );
};

export default Textbox;
