const { exec } = require('child_process');
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

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

    win.webContents.openDevTools()

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

/* exec("py commands/index.py", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
}); */
