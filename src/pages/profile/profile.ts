import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  pages: any;
  photo: any = [
    { id: "1", name: "A", img: "https://ionicframework.com/dist/preview-app/www/assets/img/advance-card-jp.jpg", description: "I" },
    { id: "2", name: "B", img: "https://ionicframework.com/dist/preview-app/www/assets/img/thumbnail-kitten-1.jpg", description: "II" },
    { id: "3", name: "C", img: "https://ionicframework.com/dist/preview-app/www/assets/img/advance-card-jp.jpg", description: "III" },
    { id: "4", name: "D", img: "https://ionicframework.com/dist/preview-app/www/assets/img/thumbnail-kitten-1.jpg", description: "IV" },
    { id: "5", name: "E", img: "https://ionicframework.com/dist/preview-app/www/assets/img/advance-card-jp.jpg", description: "V" },
    { id: "6", name: "F", img: "https://ionicframework.com/dist/preview-app/www/assets/img/thumbnail-kitten-1.jpg", description: "VI" }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = 'bio';
  }

  ionViewDidLoad() {
    this.pages = 'bio';
  }

  goSearch() {
    this.navCtrl.push(SearchPage);
  }

}
