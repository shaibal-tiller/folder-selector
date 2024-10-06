import React, { useEffect, useState } from 'react';
import '../styles/directory.css';
import { usePreview } from './usePreview';
import DirectoryButton from './DirectoryButton';
import Loading, { Error } from './Loading';
import FilePreview from './FilePreview';
import Base_2 from './Base_2.js';
import VideoStreamModal from './VideoStreamModal';
import { marker } from 'leaflet';

const ACCEPTED_TYPE = '.mp4';

function Base({ directorySetter, files, setFiles, setMarkers_,markers_ }) {
  const [thumbnailProperties, setThumbnailProperties] = useState({ width: 0, height: 0, size: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { error, imageUrl, imageSize } = usePreview(files, setIsLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);



  
  useEffect(() => {
    
    
    if (!files?.length) {

      setThumbnailProperties({ width: 0, height: 0, size: 0 });
    }

  }, [files]);

  const openDirectory = async (mode = 'read') => {
    const supportsFileSystemAccess = 'showDirectoryPicker' in window && (() => {
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
            if (entry.name.endsWith(ACCEPTED_TYPE)) {
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
        const handle = await window.showDirectoryPicker({ mode });
        directoryStructure = getFiles(handle, undefined);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log(err.name, err.message);
        }
      }
      return directoryStructure;
    }

    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;

      input.addEventListener('change', () => {
        let files_ = Array.from(input.files);
        resolve(files_);
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
    <div className='flex justify-center items-center h-full' onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClick(); }}>
      {files && files.length ? (
        <div className='relative w-full h-full overflow-hidden' onClick={e => e.stopPropagation()}>
          {isLoading && <Loading />}
          {error ? (
            <Error message="Image Extraction Failed with Error" />
          ) : (
            <Base_2  markers_={markers_}  setMarkers_={setMarkers_} imageUrl={imageUrl} imageSize={imageSize} />
          )}
          <FilePreview files={files} thumbnailProperties={thumbnailProperties} />
        </div>
      ) : (
        <DirectoryButton handleClick={handleClick} />
      )}
      <VideoStreamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Base;
