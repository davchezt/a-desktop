import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild(Content) content: Content;
  @ViewChild('searchInput') searchInput;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      //this.searchInput.setFocus();
    }, 100)
  }

  getSearch(event) {
    const val = event.target.value;
    console.log(val);
  }

}
