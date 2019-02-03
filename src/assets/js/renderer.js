const electron = require('electron')
const shell = electron.shell
const remote = electron.remote
const fs = require('fs')
const path = require('path')

const windowClicks = () => {
  // Minimize
  document.getElementById('min-button').addEventListener('click', function (e) {
    remote.getCurrentWindow().minimize()
  })
  // Maximize
  // document.getElementById('max-button').addEventListener('click', function (e) {
  //   if (!remote.getCurrentWindow().isMaximized()) {
  //     remote.getCurrentWindow().maximize()
  //   } else {
  //    remote.getCurrentWindow().unmaximize()
  //   }
  // })
  // Close
  document.getElementById('close-button').addEventListener('click', function (e) {
    remote.getCurrentWindow().close()
  })
}
const shortcuts = () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      if (!remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().maximize()
      } else {
      remote.getCurrentWindow().unmaximize()
      }
    }
    if (e.key === 'F5') {
      remote.getCurrentWindow().reload()
    }
    if (e.key === 'F12') {
      remote.getCurrentWindow().toggleDevTools()
    }
    if (e.ctrlKey && (e.key === 'w' || e.key === 'W')) {
      remote.getCurrentWindow().close()
    }
  })
}

onload = () => {
  windowClicks();
  shortcuts();
}