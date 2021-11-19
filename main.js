const { exec } = require('child_process');
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const dotenv = require('dotenv');

dotenv.config({path: './.env'});

try {
    require('electron-reloader')(module)
  } catch (_) {}

function createWindow() {
    
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        resizable: false, 
        alwaysOnTop: true,
        autoHideMenuBar: true,
        titleBarStyle: 'hiddenInset',
        title: 'SIGMA',
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    win.loadFile('./src/views/index.html');

    win.webContents.openDevTools();

}

app.whenReady().then(createWindow)

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate',()=>{
    if(BrowserWindow.getAllWindows().length === 0){
        createWindow()
    }
})

ipcMain.on('request-mainprocess-action', (event, arg)=>{
    console.log(arg);
})

