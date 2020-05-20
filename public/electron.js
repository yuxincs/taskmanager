const electron = require('electron');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = 'ELECTRON_IS_DEV' in process.env ? parseInt(process.env.ELECTRON_IS_DEV, 10) === 1 : !app.isPackaged;

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({width: 700, height: 700, webPreferences: { nodeIntegration: true }});
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});