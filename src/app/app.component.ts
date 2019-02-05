import { Component } from '@angular/core';
import { Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';

import { Common } from '../providers/common/common';
import { Api } from '../providers/api/api';
import { DataProvider } from '../providers/data/data';
import { SocketProvider } from '../providers/socket/socket';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public menu: MenuController,
    private events: Events,
    private storage: Storage,
    private common: Common,
    private api: Api,
    private dataService: DataProvider,
    private dataServices: DataProvider,
    private socketServices: SocketProvider
  ) {
    this.storage.get('userData').then((data) => {
      if (!this.common.isShowLoading) this.common.presentLoading();
      if (data) {
        let userData = JSON.parse(data);
        userData.user_id = parseInt(userData.user_id);
        if (!this.dataService.user.user_id) {
          this.dataService.user = userData;
        }
        let timeOut = userData.pic ? 100:1000;
        setTimeout(() => {
          if (this.common.isShowLoading) this.common.closeLoading();
          this.rootPage = MenuPage;
        }, timeOut);
      } else {
        if (this.common.isShowLoading) this.common.closeLoading();
        this.rootPage = LoginPage;
      }
      this.platformReady();
      this.subscribeToEvents();
    }).catch((error) => {
      console.log(error);
    });
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    // Background
    this.platform.pause.subscribe(data => {
      console.log('app:pause');
    });
    this.platform.resume.subscribe(data => {
      console.log("app:resume");
    });

    // Detect on reload/close app
    // window.addEventListener('beforeunload', () => {
    //   this.dataServices.roomsLeave();
    //   this.socketServices.disconnect();
    // });
    Observable.fromEvent(window, 'beforeunload').subscribe(event => {
      this.dataServices.roomsLeave();
      this.socketServices.disconnect();
    });
  }

  subscribeToEvents() {
    this.events.subscribe('user:login', (data) => {
      if (data) this.getUserData(data);
    });
    this.events.subscribe('user:logout', (data) => {
      if(data) console.log(data);
      this.clearUserData();
    });
  }

  getUserData(data: any) {
    let postData = new FormData();
    postData.append("uid", data.user_id);
    postData.append("token", data.token);
    let userData = this.api.post("v1/user/token", postData);
    userData.subscribe(result => {
      this.storage.set('userData', JSON.stringify(data));
      let timeOut = data.pic ? 100:1000;
      setTimeout(() => {
        if (this.common.isShowLoading) this.common.closeLoading();
        this.rootPage = MenuPage;
      }, timeOut);
    }, error => {
      if (this.common.isShowLoading) this.common.closeLoading();
      this.rootPage = LoginPage;
    });
  }

  clearUserData() {
    this.storage.get('userData').then((userData) => {
      if (userData) {
        this.storage.remove('userData');
        setTimeout(() => {
          if (this.common.isShowLoading) this.common.closeLoading();
          this.rootPage = LoginPage;
        }, 100);
      }
    });
  }
}

