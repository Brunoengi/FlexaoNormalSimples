const { contextBridge, ipcRenderer } = require('electron')

const API = {
    abrirJanela1: () => ipcRenderer.send('abrirJanelaSecundaria1'),

    dadosRotinaPrincipal: (dadosPrincipal) => ipcRenderer.send('enviarDados', dadosPrincipal),

    enviarDados: (callback) => ipcRenderer.on("dadosSalvos", (event,args) => {
        callback(args)
    })
}

contextBridge.exposeInMainWorld("api", API)