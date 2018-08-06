const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let deeplinkingUrl

// This will check if the app is already running
// https://github.com/electron/electron/blob/master/docs/api/app.md#appmakesingleinstancecallback
const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  // Protocol handler for windows
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = argv.slice(1)
  }
  logEverywhere("app.makeSingleInstance# " + deeplinkingUrl)

  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
  }
})

if (shouldQuit) {
    app.quit()
    return
}

// Define custom protocol handler. Deep linking works on packaged versions of the application!
// Be sure to call it before the app.ready event!
app.setAsDefaultProtocolClient('tel')

// Create the app window
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Protocol handler for osx
app.on('open-url', function (event, url) {
  event.preventDefault()
  deeplinkingUrl = url
  logEverywhere("open-url# " + deeplinkingUrl)
})

// Log both at dev console and at running node console instance
function logEverywhere(s) {
    console.log(s)
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
    }
}

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.webContents.openDevTools()

  // Protocol handler for win32
  if (process.platform == 'win32') {
    // Keep only command line / deep linked arguments
    deeplinkingUrl = process.argv.slice(1)
  }
  logEverywhere("createWindow# " + deeplinkingUrl)

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  logEverywhere('tel isDefaultProtocolClient: ' + app.isDefaultProtocolClient('tel'))
}