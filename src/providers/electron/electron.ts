import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame, remote } from 'electron';
import isElectron from 'is-electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable()
export class Electron {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  public remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  currentZoom: number = 0;
  constructor() {
    if (this.isElectron()) {
      this.ipcRenderer = ipcRenderer;
      this.webFrame = webFrame;
      this.remote = remote;

      this.childProcess = childProcess;
      this.fs = fs;
    }
  }

  zoomIn(){
    if (this.isElectron()) this.webFrame.setZoomLevel(++this.currentZoom);
  }

  zoomOut(){
    if (this.isElectron()) this.webFrame.setZoomLevel(--this.currentZoom);
  }

  isElectron = () => {
    return isElectron;
  }

}