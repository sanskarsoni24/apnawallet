
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ipcRenderer: {
      // Send a message to main process
      send: (channel, data) => {
        // Whitelist channels to secure the communication
        const validChannels = [
          'menu:open',
          'app:quit',
          'document:open'
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      // Call a main process function and get the result
      invoke: (channel, data) => {
        // Whitelist channels to secure the communication
        const validChannels = [
          'auth:biometric',
          'auth:biometric:available',
          'documents:offline:get',
          'documents:offline:save',
          'notification:show',
          'app:check-updates',
          'system:info'
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, data);
        }
        return Promise.reject(new Error(`Channel ${channel} is not allowed`));
      },
      // Listen for messages from main process
      on: (channel, func) => {
        const validChannels = [
          'menu:new-document',
          'menu:export-documents',
          'menu:import-documents',
          'menu:about',
          'update:available'
        ];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
      },
      // Remove listener
      removeListener: (channel, func) => {
        const validChannels = [
          'menu:new-document',
          'menu:export-documents',
          'menu:import-documents',
          'menu:about',
          'update:available'
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.removeListener(channel, func);
        }
      }
    },
    // Expose system information
    isDesktop: true,
    platform: process.platform,
    version: process.versions.electron
  }
);

// Notify the renderer process that preload script has loaded
window.addEventListener('DOMContentLoaded', () => {
  window.postMessage({ type: 'electron-loaded' }, '*');
});
