import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FeedProvider {
  apiUrl: string = "http://localhost";
  socketUrl: string = 'http://localhost:8080';
  headers:any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(public http: HttpClient) {
    // console.log('Hello FeedProvider Provider');
  }

  getUser(userId) {
    let endpoint = 'v1/nama/' + userId;
    return this.http.get(this.apiUrl + '/' + endpoint);
  }

  getPetani(start?:string, limit?:string, detail?:boolean) {
    let s = start ? '/' + start:'';
    let l = limit ? '/' + limit + '/':'';
    if (detail) {
      let body = new FormData();
      body.append("detail", "yes");
      return this.http.post(this.apiUrl + '/v1/user/petani' + s + l, body);
    }

    return this.http.get(this.apiUrl + '/v1/user/petani' + s + l);
  }

  getAgronomis(start?:string, limit?:string, detail?:boolean) {
    let s = start ? '/' + start:'';
    let l = limit ? '/' + limit + '/':'';
    if (detail) {
      let body = new FormData();
      body.append("detail", "yes");
      return this.http.post(this.apiUrl + '/v1/user/agronomis' + s + l, body);
    }

    return this.http.get(this.apiUrl + '/v1/user/agronomis' + s + l);
  }

  getBandar(start?:string, limit?:string, detail?:boolean) {
    let s = start ? '/' + start:'';
    let l = limit ? '/' + limit + '/':'';
    if (detail) {
      let body = new FormData();
      body.append("detail", "yes");
      return this.http.post(this.apiUrl + '/v1/user/bandar' + s + l, body);
    }

    return this.http.get(this.apiUrl + '/v1/user/bandar' + s + l);
  }

  getFeed(userId) {
    return this.http.get(this.socketUrl + '/feed/' + userId, { headers: this.headers });
  }

  addFeed(userId, message, id, ref) {
    let data = JSON.stringify({
      message: message,
      data: {
        id: id,
        ref: ref
      }
    });
    return this.http.post(this.socketUrl + '/feed/' + userId, data, { headers: this.headers });
  }

  readFeed(feedId) {
    return this.http.patch(this.socketUrl + '/feed/' + feedId, { read: true }, { headers: this.headers });
  }

  deleteFeed(feedId) {
    return this.http.delete(this.socketUrl + '/feed/' + feedId, { headers: this.headers });
  }

}
