const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onPlaySound: (handler) => ipcRenderer.on('play-sound', handler)
});