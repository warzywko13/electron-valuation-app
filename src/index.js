const { app, BrowserWindow } = require("electron");
const path = require('path');

const pricingHandler = require("./backend/ipcHandlers/pricingHandler");
const installTable = require("./backend/database/installTable");
const updateTable = require("./backend/database/updateTable");
const settingsHandler = require("./backend/ipcHandlers/settingsHandler");
const mainHandler = require("./backend/ipcHandlers/mainHandler");
const pricingPDFHandler = require("./backend/ipcHandlers/pricingPDFHandler");

process.env.NODE_ENV = 'production';

// const electronReload = require('electron-reload');
// electronReload(path.join(__dirname, 'src'), {
//     electron: path.join(__dirname, '../node_modules/.bin/electron')
// });

function createWindow() {
    const mainWindow = new BrowserWindow({
      height: 800,
      width: 800,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '/frontend/js/preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        enableRemoteModule: false
      }
    });
    mainWindow.maximize();
  
    // Tylko podczas robienia dev
    // mainWindow.webContents.openDevTools();
  
    mainWindow.setMenu(null);

    // Instaluj tabele
    installTable();
    // Aktualizuj tabele
    updateTable();
  
    mainWindow.loadFile('src/frontend/view/main.html');
  
    mainWindow.once("ready-to-show", () => { mainWindow.show(); });

    // wszystkie handlery
    mainHandler(mainWindow);
    pricingHandler(mainWindow);
    settingsHandler(mainWindow);
    pricingPDFHandler(mainWindow);
}
  
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit();
});