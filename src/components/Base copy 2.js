import React, { useEffect, useState, useRef } from 'react';
import '../styles/directory.css';
import { usePreview } from './usePreview';

function Base({ directorySetter }) {
  const [files, setFiles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailProperties, setThumbnailProperties] = useState({ width: 0, height: 0, size: 0 });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const test_thumb = usePreview(files);

  useEffect(() => {
    if (files && files.length) {
      const firstVideo = files.find(file => file.type.startsWith('video/'));
      if (firstVideo) {
        const url = URL.createObjectURL(firstVideo);
        setThumbnail(url);

        const video = videoRef.current;
        video.src = url;

        video.onloadedmetadata = () => {
          video.currentTime = 1; // Capture a frame at 1 second
        };

        video.onseeked = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imgDataUrl = canvas.toDataURL('image/png');

          const img = new Image();
          img.onload = () => {
            setThumbnailProperties({
              width: img.width,
              height: img.height,
              size: firstVideo.size
            });
          };
          img.src = imgDataUrl;

          URL.revokeObjectURL(url);
        };
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
        const handle = await window.showDirectoryPicker({ mode });
        directoryStructure = getFiles(handle, undefined);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message);
        }
      }
      return directoryStructure;
    }

    // Fall back to using file input if File System Access API is not supported
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;

      input.addEventListener('change', () => {
        let files = Array.from(input.files);
        resolve(files);
      });
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    });
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

    directorySetter(directoryInfo);
  };

  return (
    <div className='flex justify-center items-center h-full' onClick={handleClick}>
      {files && files.length ?
        <div className='w-full h-full overflow-hidden' onClick={e => e.stopPropagation()}>
          <img className='w-full h-full object-contain border-2' src={test_thumb} />
          <div className=''>
            <p>Resolution: {thumbnailProperties.width}x{thumbnailProperties.height}</p>
            <p>Size: {thumbnailProperties.size} bytes</p>
          </div>
        </div> :
        <button
          className="px-2 py-1 bg-light-2 bg-opacity-30 rounded-md text-light-2 text-lg hover:shadow-md hover:scale-105 active:scale-95"
          type="button"
          onClick={handleClick}
        >
          Open directory
        </button>}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default Base;
