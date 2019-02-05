import { Component } from '@angular/core';
import { Electron } from '../../providers/electron/electron';

@Component({
  selector: 'controll-box',
  templateUrl: 'controll-box.html'
})
export class ControllBoxComponent {
  isMaximized: boolean = true;
  isFullScreen: boolean = false;
  isElectron: boolean = false;
  winown: any;

  text: string;

  constructor(private electron: Electron) {
    if (this.electron.isElectron()) {
      this.isElectron = true;
      console.log("Electron Mode");
      this.winown = this.electron.remote.getCurrentWindow();

      this.isMaximized = this.winown.isMaximized();
      window.addEventListener('resize', (ev) => {
        this.isMaximized = this.winown.isMaximized();
      });
      window.addEventListener("keydown", (event) => {
        if (event.key === 'F12') {
          this.dev();
        }
        if (event.ctrlKey && (event.key === 'r' || event.key === 'R')) {
          this.winown.reload();
        }
      });
    }
    this.text = 'AgriFarm&reg; v0.1.0&beta;';
  }

  minimize() {
    this.winown.minimize();
  }

  maximize() {
    if (!this.winown.isMaximized()) {
      this.winown.maximize();
      this.isMaximized = true;
    } else {
      this.winown.unmaximize();
      this.isMaximized = false;
    }
  }

  fullscreen() {
    if (this.isFullScreen) {
      this.winown.setFullScreen(false)
      this.isFullScreen = false;
    }
    else {
      this.winown.setFullScreen(true)
      this.isFullScreen = true;
    }

    return false;
  }

  close() {
    this.winown.close();
  }

  dev() {
    this.winown.toggleDevTools({ mode:'undocked' });

    return false;
  }

  default() {
    console.log("default()");
    return false;
  }

}
