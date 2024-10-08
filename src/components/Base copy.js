import React, { useEffect, useRef, useState } from 'react';
import ReactVideoThumbnail from 'react-video-thumbnail';
import '../styles/directory.css';

function Base({ directorySetter }) {
  const [files, setFiles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailProperties, setThumbnailProperties] = useState({ width: 0, height: 0, size: 0 });

  const getProperty = () => {
    return document.getElementsByClassName('react-thumbnail-generator')
  }

  useEffect(() => {
    if (files && files.length) {
      const firstVideo = files.find(file => file.type.startsWith('video/'));
      if (firstVideo) {
        const url = URL.createObjectURL(firstVideo);

        setThumbnail(url); 
        // console.log(getProperty()[0].children[0])
        // Create an Image object to load the thumbnail and get its properties
        const img = new Image();
        img.onload = () => {
          setThumbnailProperties({
            width: img.width,
            height: img.height,
            size: firstVideo.size
          }); 
        };
        img.src = url;
      }
    }
  }, [files]);

  const openDirectory = async (mode = 'read') => {
    setThumbnail(null);
    const supportsFileSystemAccess =
      'showDirectoryPicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();

    if (supportsFileSystemAccess) {
      let directoryStructure = undefined;

      const getFiles = async (dirHandle, path = dirHandle.name) => {
        const dirs = [];
        const files = [];

        for await (const entry of dirHandle.values()) {
          const nestedPath = `${path}/${entry.name}`;
          if (entry.kind === 'file') {
            files.push(
              entry.getFile().then((file) => {
                file.directoryHandle = dirHandle;
                file.handle = entry;
                return Object.defineProperty(file, 'webkitRelativePath', {
                  configurable: true,
                  enumerable: true,
                  get: () => nestedPath,
                });
              })
            );
          } else if (entry.kind === 'directory') {
            dirs.push(getFiles(entry, nestedPath));
          }
        }

        return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))];
      };

      try {
        const handle = await window.showDirectoryPicker({
          mode,
        });

        directoryStructure = getFiles(handle, undefined);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      }
      return directoryStructure;
    }

    // return new Promise((resolve) => {
    //   const input = document.createElement('input');
    //   input.type = 'file';
    //   input.webkitdirectory = true;

    //   input.addEventListener('change', () => {
    //     let files = Array.from(input.files);
    //     resolve(files);
    //   });
    //   if ('showPicker' in HTMLInputElement.prototype) {
    //     input.showPicker();
    //   } else {
    //     input.click();
    //   }
    // });
  };


  const handleClick = async () => {
    const filesInDirectory = await openDirectory();
    if (!filesInDirectory) {
      return;
    }


    setFiles(Array.from(filesInDirectory));

    // Get folder name from the first file's path
    const folder_name = filesInDirectory.length > 0 ? filesInDirectory[0].webkitRelativePath.split('/')[0] : '';
    const file_list = filesInDirectory.map(file => file.name);
    const number_of_files = filesInDirectory.length;

    const directoryInfo = {
      folder_name,
      file_list,
      number_of_files,
      thumb_details: thumbnailProperties
    };
    console.log(directoryInfo);

    // Set the directory info using directorySetter
    directorySetter(directoryInfo);
  };

  return (
    <div>
      <button
        className="px-2 py-1 bg-light-2 bg-opacity-30 rounded-md text-light-2 text-lg hover:shadow-md hover:scale-105 active:scale-95"
        type="button"
        onClick={handleClick}
      >
        Open directory
      </button>
      <pre>
        {thumbnail ? <ReactVideoThumbnail className="hidden" videoUrl={thumbnail} /> : <></>}
        {thumbnail && (
          <div>
            <p>Resolution: {thumbnailProperties.width}x{thumbnailProperties.height}</p>
            <p>Size: {thumbnailProperties.size} bytes</p>
          </div>
        )}
      </pre>
    </div>
  );
}

export default Base;
