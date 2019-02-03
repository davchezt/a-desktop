'use strict';
const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');

let win, serve;
let args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
let url = serve ? 'http://localhost:8100':`file://${path.join(__dirname, '../www/index.html')}`;

function createWindow() {
    win = new BrowserWindow({ width: 480, height: 720, frame: false, resizable: false });
    win.loadURL(url);
    win.setMenu(null);
    // win.webContents.openDevTools({ mode:'undocked' }); // enable/disable by pressing F12

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

app.on('will-quit', () => {
  // nothing...
})