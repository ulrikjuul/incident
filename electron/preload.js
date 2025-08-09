const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveIncidents: (incidents) => ipcRenderer.invoke('save-incidents', incidents),
  loadIncidents: () => ipcRenderer.invoke('load-incidents')
});