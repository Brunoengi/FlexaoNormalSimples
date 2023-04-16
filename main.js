const { app, BrowserWindow,ipcMain } = require('electron')
const path = require('path')

let dados = []

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
    
  })
  win.maximize()
  win.loadFile('index.html')
}

ipcMain.on('enviarDados', (evento, args) => {dados[0] = args})


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//-------------------------------------------------------------------------------------------------------------

function criarJanelaSecundaria1() {
  let janelaSecundaria1 = new BrowserWindow({
      width: 820, height: 770, webPreferences:{preload: path.join(__dirname, 'preload.js')}
  })
  janelaSecundaria1.loadFile('./src/pages/memorialCalculo/longitudinal.html')
  janelaSecundaria1.webContents.send("dadosSalvos", dados)
}

ipcMain.on('abrirJanelaSecundaria1', (event, args) => {criarJanelaSecundaria1()})

