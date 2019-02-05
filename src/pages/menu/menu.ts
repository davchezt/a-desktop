import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, MenuController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Electron } from '../../providers/electron/electron';
import { Common } from '../../providers/common/common';
// import { Api } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { SocketProvider } from '../../providers/socket/socket';
import { DashboardPage } from '../dashboard/dashboard';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';
import { ContactPage } from '../contact/contact';
import { TabsPage } from '../tabs/tabs';
import { AboutPage } from '../about/about';
import { RoomPage } from '../room/room';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, icon: string, component: any, openTab?:any}>;
  pagesTwo: Array<{title: string, icon: string, component: any, openTab?:any}>;
  pagesThree: Array<{title: string, icon: string, component: any, openTab?:any}>;
  rootPage:any = DashboardPage;
  onMessage: any;
  onNewRoom: any;
  onUser: any;

  userData:any = {
    user_id: null,
    token: "",
    name: "",
    gender: "0",
    pic: "",
    type: "0",
    latitude: "",
    longitude: ""
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public elect: Electron,
    public menu: MenuController,
    private events: Events,
    private storage: Storage,
    private common: Common,
    // private api: Api,
    private dataServices: DataProvider,
    private socketServices: SocketProvider
  ) {
    this.storage.get('userData').then((data) => {
      if (data) {
        this.userData = JSON.parse(data);
      }
      this.registerPages();
    }).catch((error) => {
      console.log(error);
    });
  }

  ionViewWillLoad() {
    this.socketServices.connect();
    this.storage.get('userData').then((data) => {
      if (data) {
        let userData = JSON.parse(data);
        userData.user_id = parseInt(userData.user_id);

        if (this.dataServices.user.user_id === null) this.dataServices.user = userData;
        this.dataServices.getRoom();
        this.dataServices.loadNewRoom();
        this.socketServices.emit('online', userData.user_id);
      }
    }).catch((error) => {
      console.log(error);
    });
    this.onMessage = this.socketServices.on('message').subscribe(data => {
      let message: any = data;
      if (message.chat) {
        this.dataServices.newMessage(message.room, message.chat);
      }
    });
    this.onNewRoom = this.socketServices.on('new-room').subscribe(data => {
      console.log("menu:new-room:", data);
      this.dataServices.loadNewRoom(true);
    });
    this.onUser = this.socketServices.on('user').subscribe(data => {
      let message: any = data;
      switch(message.event) {
      case 'join':
        console.log("menu:join:", message);
        break;
      case 'leave':
        console.log("menu:leave:", message);
        break;
      case 'online':
        console.log("menu:online:", message);
        this.dataServices.clients = message.user;
        this.events.publish('user:online');
        break;
      case 'offline':
        console.log("menu:offline:", message);
        this.dataServices.clients = message.user;
        this.events.publish('user:offline');
        break;
      default:
        console.log("menu:unknown:", message);
        break;
      }
    });
  }

  ionViewWillUnload() {
    // alert("ionViewWillUnload");
    this.dataServices.roomsLeave();
    this.socketServices.disconnect();
  }

  registerPages() {
    this.pages = [
      { title: 'Beranda', icon: 'ios-home-outline', component: DashboardPage },
      { title: 'Profile', icon: 'ios-contact-outline', component: ProfilePage },
      { title: 'Video', icon: 'ios-videocam-outline', component: RoomPage }
    ];

    this.pagesTwo = [
      { title: 'Pengaturan', icon: 'ios-settings-outline', component: SettingsPage },
      { title: 'Feedback', icon: 'ios-mail-outline', component: ContactPage },
      // { title: 'Call', icon: 'ios-videocam-outline', component: RoomPage }
    ];

    this.pagesThree = [
      { title: 'Laporkan', icon: 'ios-bug-outline', component: TabsPage, openTab: 1 },
      { title: 'Tentang', icon: 'ios-information-circle-outline', component: AboutPage }
    ];
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'MainMenu');
  }

  zoomIn(){
    this.elect.zoomIn();
  }
  zoomOut(){
    this.elect.zoomOut();
  }

  openPopup(page) {
    // this.socket.emit('leave-room');
    this.navCtrl.push(page.component);
  }

  openPage(page) {
    // this.socket.emit('leave-room');
    this.nav.setRoot(page.component, { openTab: page.openTab });
  }

  // openPageParam(page) {
  //   this.socket.emit('leave-room');
  //   this.nav.setRoot(page.component, { openTab: page.openTab, caller: true });
  // }

  logout() {
    let time = new Date();
    this.common.presentLoading();
    setTimeout(() => {
      this.common.closeLoading();
      this.events.publish('user:logout', time.getTime());
    }, 500);
  }

}
