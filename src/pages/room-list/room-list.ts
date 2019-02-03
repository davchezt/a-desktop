import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { RoomChatPage } from '../room-chat/room-chat';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-room-list',
  templateUrl: 'room-list.html',
})
export class RoomListPage {
  pages: string = 'chat';
  userData: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataServices: DataProvider,
    public events: Events,
    private common: Common,
    private api: Api
  ) {
    this.userData = this.dataServices.user;
    this.userData.user_id = parseInt(this.userData.user_id);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RoomListPage');
  }

  onSegmentChange() {
    if (this.pages === 'new') {
      // console.log(this.dataServices.newrooms)
    }
  }

  openChat(id) {
    if (id) {
      if (this.pages == 'new') {
        this.navCtrl.push(RoomChatPage, { roomId: id, callback: this.callback, callbackData: 'new' });

        return;
      }
      this.navCtrl.push(RoomChatPage, { roomId: id, callback: this.callback });
    }
  }

  joinChat(id) {
    this.navCtrl.push(RoomChatPage, {
      roomId: id,
      join: true,
      callback: this.callback,
      callbackData: 'new'
    });
  }

  callback = (data?) => {
    this.dataServices.getRoom(true);
    if (data == 'new') {
      this.dataServices.loadNewRoom(true);
    }
  };

}
