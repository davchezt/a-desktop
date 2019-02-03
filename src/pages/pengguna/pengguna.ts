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
  agronomis: any = [];
  bandar: any = [];
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
    console.log(val);
  }

  doInfinite(infiniteScroll) {
    let limit: any;
    switch(this.pages) {
      case 'petani':
      limit = this.petani.length;
      break;
      case 'agronomis':
      limit = this.agronomis.length;
      break;
      default:
      limit = this.bandar.length;
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
    this.limit = 10;
    if (this.pages === 'petani') {
      this.getPetani();
    }
    else if (this.pages === 'agronomis') {
      this.getAgronomis();
    }
    else {
      this.getBandar();
    }
  }

  getPetani() {
    this.feed.getPetani("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.petani = response.data;
      console.log(this.petani);
    }, err => {
      console.log(err);
    });
  }

  getAgronomis() {
    this.feed.getAgronomis("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.agronomis = response.data;
      console.log(this.agronomis);
    }, err => {
      console.log(err);
    });
  }

  getBandar() {
    this.feed.getBandar("0", this.limit, true).subscribe(data => {
      let response:any = data;
      this.bandar = response.data;
      console.log(this.bandar);
    }, err => {
      console.log(err);
    });
  }

}
