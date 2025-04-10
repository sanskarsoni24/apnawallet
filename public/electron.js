const { app, BrowserWindow, ipcMain, Menu, Notification, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      spellcheck: true
    },
    icon: path.join(__dirname, 'apple-touch-icon.png'),
    titleBarStyle: 'hiddenInset', // nicer title bar on macOS
    autoHideMenuBar: false, // show menu bar
    backgroundColor: '#ffffff'
  });

  // Load the index.html in development or the built app in production
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools(); // Open DevTools in development
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  // Set up system menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Document',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:new-document')
        },
        { type: 'separator' },
        {
          label: 'Export Documents',
          click: () => mainWindow.webContents.send('menu:export-documents')
        },
        {
          label: 'Import Documents',
          click: () => mainWindow.webContents.send('menu:import-documents')
        },
        { type: 'separator' },
        {
          label: isDev ? 'Quit Dev App' : 'Quit Surakshit Locker',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://surakshitlocker.com/help');
          }
        },
        {
          label: 'About Surakshit Locker',
          click: () => mainWindow.webContents.send('menu:about')
        }
      ]
    }
  ];

  // Add platform specific menu items
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for communication with renderer process

// Biometric authentication
ipcMain.handle('auth:biometric', async () => {
  try {
    // This would use platform-specific biometric APIs in a real implementation
    // For demo purposes, we'll simulate success after a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return { success: false, error: error.message };
  }
});

// Check biometric availability
ipcMain.handle('auth:biometric:available', async () => {
  try {
    // In a real implementation, check system capabilities
    // For demo, return true on Mac/Windows
    const available = process.platform === 'darwin' || process.platform === 'win32';
    return { available };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return { available: false, error: error.message };
  }
});

// Offline document management
ipcMain.handle('documents:offline:get', async () => {
  try {
    // In a real app, read from a local secure storage
    return { documents: [] };
  } catch (error) {
    console.error('Error getting offline documents:', error);
    return { documents: [], error: error.message };
  }
});

ipcMain.handle('documents:offline:save', async (_, { document }) => {
  try {
    // In a real app, save to local secure storage
    console.log('Saving document for offline access:', document.id);
    return { success: true };
  } catch (error) {
    console.error('Error saving document offline:', error);
    return { success: false, error: error.message };
  }
});

// Desktop notifications
ipcMain.handle('notification:show', (_, { title, body, options }) => {
  try {
    new Notification({ title, body, ...options }).show();
    return { success: true };
  } catch (error) {
    console.error('Error showing notification:', error);
    return { success: false, error: error.message };
  }
});

// App updates
ipcMain.handle('app:check-updates', async () => {
  // Simulate update check
  return { available: false, version: app.getVersion() };
});

// System information
ipcMain.handle('system:info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    osVersion: process.getSystemVersion(),
    electronVersion: process.versions.electron
  };
});
