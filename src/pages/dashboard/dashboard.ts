import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs, Events } from 'ionic-angular';

import { HomePage } from '../home/home';
import { PenggunaPage } from '../pengguna/pengguna';
import { RoomListPage } from '../room-list/room-list';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {
  chatCount: number = 0;
  tab1 = HomePage;
  tab2 = PenggunaPage;
  tab3 = RoomListPage;

  @ViewChild("dTabs") tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public event: Events) {
    this.event.subscribe('chat:updated', (data) => {
      this.chatCount = data.count;
    });
    this.event.subscribe('chat:read', () => {
      this.chatCount = 0;
    });
  }

  // ionViewWillLoad() {
  //   console.log('ionViewWillLoad')
  // }

  // ionViewWillUnload() {
  //   console.log('ionViewWillUnload')
  // }

  ionViewDidLoad() {
    let openTab = this.navParams.get("openTab");
    if (openTab) {
      this.tabRef.select(openTab)
    }
  }

}
