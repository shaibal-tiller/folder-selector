const { ipcRenderer } = require('electron');

export const openDirectory = () => {
  ipcRenderer.send('open-directory-dialog');
};

export const listenForDirectorySelected = (callback) => {
  ipcRenderer.on('selected-directory', (event, path) => {
    callback(path);
  });
};

export const removeDirectoryListener = () => {
  ipcRenderer.removeAllListeners('selected-directory');
};
