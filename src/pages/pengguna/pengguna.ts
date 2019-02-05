import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { FeedProvider } from '../../providers/feed/feed';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-pengguna',
  templateUrl: 'pengguna.html',
})
export class PenggunaPage {
  @ViewChild(Content) content: Content;
  @ViewChild('searchInput') searchInput;
  petani: any = [];
  petaniCount: any = 0;
  agronomis: any = [];
  agronomisCount: any = 0;
  bandar: any = [];
  bandarCount: any = 0;
  pages: string = 'petani';
  limit: any = 10;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public feed: FeedProvider,
    public http: HttpClient
  ) {
    this.pages = 'petani';
  }

  ionViewDidLoad() {
    this.pages = 'petani';
    this.getPetani();
  }

  getSearch(event) {
    const val = event.target.value;
    console.log(val !== undefined ? val:'reset');
  }

  doInfinite(infiniteScroll) {
    console.log("limit:", this.limit);
    let limit: any;
    switch(this.pages) {
      case 'petani':
        limit = this.petaniCount;
        break;
      case 'agronomis':
        limit = this.agronomisCount;
        break;
      default:
        limit = this.bandarCount;
        break;
    }
    
    if (this.limit == parseInt(limit)) {
      infiniteScroll.complete();

      return;
    }

    this.limit += 10;
    
    if (this.limit >= parseInt(limit)) {
      this.limit = parseInt(limit);
    }

    setTimeout(() => {
      this.onSegmentChange();
      infiniteScroll.complete();
    }, 500);
  }

  onSegmentChange() {
    this.loadData();
  }

  loadData() {
    if (this.pages === 'petani') {
      this.getPetani();
      if (this.limit > this.petaniCount) this.limit = 10; // Reset limit
    }
    else if (this.pages === 'agronomis') {
      this.getAgronomis();
      if (this.limit > this.agronomisCount) this.limit = 10; // Reset limit
    }
    else {
      this.getBandar();
      if (this.limit > this.bandarCount) this.limit = 10; // Reset limit
    }
  }

  getPetani() {
    this.feed.getPetani("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.petani = response.data;
      this.petaniCount = response.count;
      // if (this.limit > 10) this.limit = 10; // Reset limit
      console.log(this.petani);
    }, err => {
      console.log(err);
    });
  }

  getAgronomis() {
    this.feed.getAgronomis("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.agronomis = response.data;
      this.agronomisCount = response.count;
      // if (this.limit > 10) this.limit = 10; // Reset limit
      console.log(this.agronomis);
    }, err => {
      console.log(err);
    });
  }

  getBandar() {
    this.feed.getBandar("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.bandar = response.data;
      this.bandarCount = response.count;
      // if (this.limit > 10) this.limit = 10; // Reset limit
      console.log(this.bandar);
    }, err => {
      console.log(err);
    });
  }

}
