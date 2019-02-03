import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  pages: string = 'chat';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = 'chat';
  }

  ionViewDidLoad() {
    this.pages = 'chat';
  }

}
