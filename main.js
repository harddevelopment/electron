// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray, Notification } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        resizable: false,
        center: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })


    mainWindow.webContents.openDevTools()

    // and load the index.html of the app.
    mainWindow.loadFile('static/index.html')
    //winWindow.setMenu(null)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    // mainWindow.on('closed', function() {
    //     // Dereference the window object, usually you would store windows
    //     // in an array if your app supports multi windows, this is the time
    //     // when you should delete the corresponding element.
    //     mainWindow = null
    // })

    mainWindow.on('close', function(event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }

        return false;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let tray = null
app.on('ready', () => {
    tray = new Tray('C:\\Program Files\\antivairus\\gui\\icon.png')

    var contextMenu = Menu.buildFromTemplate([{
            label: 'Show App',
            click: function() {
                mainWindow.show();
            }
        },
        {
            label: 'FileFilter: Enable',
        },
        {
            label: 'RegFilter: Enable',
        },
        {
            label: 'NetFilter: Enable',
        },
        {
            label: 'Quit',
            click: function() {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Antivairus')
    tray.setContextMenu(contextMenu)

    tray.on('double-click', () => {
        mainWindow.show();
    })
})

const { ipcMain } = require('electron')
ipcMain.on('updateTrayLabels', (evt, f, r, n) => {
    var contextMenu = Menu.buildFromTemplate([{
            label: 'Show App',
            click: function() {
                mainWindow.show();
            }
        },
        {
            label: 'FileFilter: ' + f,
        },
        {
            label: 'RegFilter: ' + r,
        },
        {
            label: 'NetFilter: ' + n,
        },
        {
            label: 'Quit',
            click: function() {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu)
})


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');