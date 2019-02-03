import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages: string = 'jadwal';
  constructor(public navCtrl: NavController) {
    this.pages = 'jadwal';
  }

  goSearch() {
    this.navCtrl.push(SearchPage);
  }

  getSearch(event) {
    const val = event.target.value;
    console.log(val);
  }

}
