import React, { useEffect, useState } from "react";
import Base from "./Base";
import Textbox from "./Textbox";
import NameDisplay from "./NameDisplay";
import ActionButtons from "./ActionButtons";
import ToggleButton from "./ToggleButton";
import axios from "axios";

// const base_url = process.env.REACT_APP_BACKEND_API
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold text-lg"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const TrafficVideoSelector = () => {
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [showNameDisplay, setShowNameDisplay] = useState(true);
  const [rectangle_markers, set_rectangle_markers] = useState([]);
  const [isStartDisable, setIsStartDisable] = useState(false);

  const [log, setLog] = useState([]);
  const [isFilesModalOpen, setFilesModalOpen] = useState(false);
  const [isLogsModalOpen, setLogsModalOpen] = useState(false);

  const handleReset = (checked) => {
    set_rectangle_markers([]);
    setOpen(false);
    setFolder(null);
    setFiles(null);
  };

  const handleToggle = () => {
    setShowNameDisplay((prev) => !prev);
  };
  const send_co_ordinates = async (flattenedData) => {
    try {
      console.log(rectangle_markers);
      const response = await axios.post(
        `https://traffics.free.beeceptor.com/lanes/quadrilaterall`,
        flattenedData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!rectangle_markers?.length) {
      setIsStartDisable(true);
      return;
    }

    if (
      [].concat(...rectangle_markers.map((obj) => Object.values(obj)))?.length %
        4 ==
      0
    ) {
      setIsStartDisable(false);
      return;
    } else {
      setIsStartDisable(true);
    }
  }, [rectangle_markers]);

  const handleStart = () => {
    const flattenedData = [].concat(
      ...rectangle_markers.map((obj) => Object.values(obj))
    );
    if (flattenedData.length) {
      send_co_ordinates(flattenedData);
    }
  };

  const ModalButtons = () => {
    return (
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setFilesModalOpen(true)}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Show Files
        </button>
        <button
          onClick={() => setLogsModalOpen(true)}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Show Logs
        </button>
      </div>
    );
  };

  return (
    <div className="h-full w-full md:grid grid-cols-12 gap-4  ">
      <div className="col-span-8 bg-white shadow-md h-[77vh] p-4">
        <Base
          markers_={rectangle_markers}
          setMarkers_={set_rectangle_markers}
          directorySetter={setFolder}
          files={files}
          setFiles={setFiles}
          log={log}
          setLog={setLog}
        />
      </div>
      <div className="hidden md:block col-span-4 bg-gray-200 shadow-md h-[77vh] overflow-y-scroll p-4">
        <Textbox
          rectangle_markers={rectangle_markers}
          setRectangleMarkers={set_rectangle_markers}
        />
      </div>
      <div className="relative col-span-8 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
        <ToggleButton onClick={handleToggle} />
        {showNameDisplay ? (
          <NameDisplay
            folder={folder}
            isOpen={isOpen}
            setOpen={setOpen}
            ModalButtons={ModalButtons}
          />
        ) : (
          <div className="md:hidden">
            <ActionButtons handleReset={handleReset} />
          </div>
        )}
      </div>
      <div className="hidden md:block col-span-4 bg-light-1 bg-opacity-20 shadow-md h-[17vh] p-4">
        <ActionButtons
          disableStatus={isStartDisable}
          handleReset={handleReset}
          handleStart={handleStart}
        />
      </div>
      <Modal
    
        isOpen={isFilesModalOpen}
        onClose={() => setFilesModalOpen(false)}
        title="Files in Folder"
      >
        {files && files.length ? (
          <ul className="list-disc list-inside max-h-64 overflow-auto ">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p>No files selected.</p>
        )}
      </Modal>
      <Modal isOpen={isLogsModalOpen} onClose={() => setLogsModalOpen(false)} title="Rectangle Logs">
  {log && log.length ? (
    <ul className="max-h-64 overflow-auto space-y-2 text-sm font-mono">
      {log.map((entry, idx) => (
        <li key={idx} className="border border-gray-300 rounded p-2">
          <div><strong>Rectangle #{entry.rectIndex}</strong></div>
          <div>Time: {entry.timestamp.toLocaleString()}</div>
          <div>Message: {entry.message}</div>
          <div>
            Points: 
            {['p1','p2','p3','p4'].map((p) => (
              <span key={p} className="ml-2">{p}({entry.marker[p].x.toFixed(1)}, {entry.marker[p].y.toFixed(1)})</span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No logs available.</p>
  )}
</Modal>
    </div>
  );
};

export default TrafficVideoSelector;
