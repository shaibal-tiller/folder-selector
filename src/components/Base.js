import React, { useEffect, useRef, useState } from 'react';
import '../styles/directory.css';
import { usePreview } from './usePreview';

const ACCEPTED_TYPE='.mp4'

const Loading = () => {
  return <div role="status" className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
}


function Base({ directorySetter, files, setFiles }) {

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailProperties, setThumbnailProperties] = useState({ width: 0, height: 0, size: 0 });
  const test_thumb = usePreview(files)
  const [isLoading, setIsLoading] = useState(false);
  const getProperty = () => {

  }



  useEffect(() => {
    if (files && files.length) {
      const firstVideo = files[0]
      if (firstVideo) {
        const url = URL.createObjectURL(firstVideo);
        

        setThumbnail(url);

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
   setTimeout(() => {
    setIsLoading(true);
   }, 500); 
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
                if (entry.name.endsWith(ACCEPTED_TYPE)) { // Filter only mp4 files
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
                }
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
      setIsLoading(false);
      return directoryStructure;

    }

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
      setIsLoading(false);
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


    // Set the directory info using directorySetter
    directorySetter(directoryInfo);
  };

  return (
    <div className='flex justify-center items-center h-full' onClick={handleClick}>
      {files && files.length ?

        <div className='relative w-full h-full overflow-hidden' onClick={e => e.stopPropagation()}>
          {isLoading && <Loading />}
          <img onLoad={(event) => {
            setIsLoading(false);
            setThumbnailProperties({
              width: event.target.naturalWidth,
              height: event.target.naturalHeight,
              size: event.target.size
            })
          }}
            onError={() => {
              setIsLoading(false);
            }}
            className=' w-full h-full object-contain border-2 ' src={test_thumb} />
          <div className='absolute bottom-0 right-0 bg-gray-800 bg-opacity-50 text-white p-2 rounded-tl-md text-sm'>
            <p>File Name: {files[0].name}</p>
            <p>File Size: {thumbnailProperties.size} bytes</p>
            <p>Image Frame Resolution: {thumbnailProperties.width}x{thumbnailProperties.height}</p>
          </div>


        </div> :
        <button
          className="px-2 py-1 bg-light-2 bg-opacity-30 rounded-md text-light-2 text-lg hover:shadow-md hover:scale-105 active:scale-95"
          type="button"
          onClick={handleClick}
        >
          Open directory
        </button>}


    </div>
  );
}

export default Base;
