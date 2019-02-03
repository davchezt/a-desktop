import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { SocketProvider } from '../socket/socket';

@Injectable()
export class DataProvider {
  socketUrl: string = 'http://localhost:8080';
  apiUrl: string = 'http://localhost';
  // Array
  feeds: any = [];
  rooms: any = [];
  newrooms: any = [];
  user:any = {
    user_id: null,
    token: "",
    name: "",
    gender: "0",
    pic: "",
    type: "0",
    latitude: "",
    longitude: ""
  };;
  clients: any = [];
  // Boolean
  inRoom: boolean = false;
  // Object
  chats: any = {};
  headers:any = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  constructor(public http: HttpClient, public socket: SocketProvider, private storage: Storage) {
    this.storage.get('userData').then((data) => {
      if (data) {
        this.user = JSON.parse(data);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  initUser(data:any) {
    this.user = JSON.parse(data);
  }

  getFeed() {
    this.http.get(this.socketUrl + '/feed/' + this.user.user_id, { headers:this.headers })
    .subscribe(data => {
      let result:any = data;
      this.feeds = result.feed;
    }, error => {
      console.log("data:provider", error);
    });
  }

  getRoom(update?:boolean) {
    this.http.get(this.socketUrl + '/room/' + this.user.user_id + '/agronomis', { headers: this.headers })
    .subscribe(data => {
      let room:any = data;
      if (update) this.rooms = [];
      if (room.count === 0) return;
      room.rooms.map(data => {
        let chat = {
          id: data.id,
          subject: data.subject,
          created: data.created,
          petani: data.petani,
          message: data.chat,
          new: 0
        }
        this.getAgronomis(data.petani).subscribe(result => {
          chat.petani = result;
        });        
        if (this.rooms.length === 0) {
          this.rooms.unshift(chat);
        }
        else {
          if (!this.roomExists(data.id)) {
            this.rooms.unshift(chat);
          }
        }
        this.updateMessage(data.id);
      });
      if (!update) this.roomsJoin();
    }, error => {
      console.log("data:provider", error);
    });
  }

  addRoom(body, cb?:any) {
    this.http.post(this.socketUrl + '/room', body, { headers: this.headers }).subscribe(data => {
      let room:any = data;
      // SOCKET JOIN
      this.socket.joinRoom(room.room_id);
      if (cb) cb(room);
    }, err => {
      console.log(err);
    })
  }

  updateMessage(roomId) {
    var that = this;
    this.http.get(this.socketUrl + "/room/read/" + roomId + "/" + this.user.user_id).subscribe(data => {
      let unread:any = data;
      Object.keys(this.rooms).forEach(function(id) {
        if (that.rooms[id].id === roomId) {
          that.rooms[id].new = unread.count;
        }
      });
    });
  }

  newMessage(roomId, chat?:any) {
    var that = this;
    Object.keys(this.rooms).forEach(function(id) {
      if (that.rooms[id].id === roomId) {
        that.rooms[id].new++;
        if (chat) {
          that.rooms[id].message = chat;
        }
      }
    });
  }

  isOnline(userId: number): boolean {
    if (this.clients.length === 0) return false;
    const index = this.clients.findIndex(user => user.id_user === userId);
    return index !== -1 ? true : false;
  }

  // New Room
  loadNewRoom(update?:boolean) {
    this.getPetaniRoom().subscribe(response => {
      let data: any = response;
      if (update) this.newrooms = [];
      if (data.count === 0) return;
      data.rooms.map(room => {
        let chat = {
          id: room.id,
          subject: room.subject,
          created: room.created,
          petani: room.petani,
          message: room.chat,
        }
        if (!this.newRoomExists(room.id)) {
          this.newrooms.unshift(chat);
        }
      });
      this.updateNewRoom();
    });
  }

  newRoomExists(roomId) {
    if (this.newrooms.length === 0) return false;
    const index = this.newrooms.findIndex(chat => chat.id === roomId);
    return index !== -1 ? true : false;
  }

  updateNewRoom() {
    var that = this;
    Object.keys(this.newrooms).forEach(function(id) {
      that.getAgronomis(that.newrooms[id].petani).subscribe(user => {
        that.newrooms[id].petani = user;
      })
    });
  }

  roomExists(roomId: string): boolean {
    if (this.rooms.length === 0) return false;
    const index = this.rooms.findIndex(chat => chat.id === roomId);
    return index !== -1 ? true : false;
  }

  roomRemove(roomId) {
    var that = this;
    Object.keys(this.rooms).forEach(function(id) {
      if (that.rooms[id].id === roomId) {
        that.rooms.splice(parseInt(id), 1);
      }
    });
  }

  roomsJoin() {
    let that = this;
    Object.keys(this.rooms).forEach(function(id) {
      that.socket.joinRoom(that.rooms[id].id);
      console.log('data:provider | joining room:', that.rooms[id].id);
    });
  }

  roomsLeave() {
    let that = this;
    Object.keys(this.rooms).forEach(function(id) {
      that.socket.leaveRoom(that.rooms[id].id);
      console.log('data:provider | leaving room:', that.rooms[id].id);
    });
  }

  getAgronomis(id) {
    let endpoint = 'v1/nama/' + id;
    return this.http.get(this.apiUrl + '/' + endpoint);
    // let that = this;
    // this.http.get(this.apiUrl + '/' + endpoint).subscribe(data => {
    //   Object.keys(this.rooms).forEach(function(id) {
    //     if (that.rooms[id].petani === id) {
    //       that.rooms[id].petani = data;
    //     }
    //   });
    // });
  }

  getPetaniRoom() {
    return this.http.get(this.socketUrl + '/room', { headers: this.headers });
  }

  getChat(roomId) {
    return this.http.get(this.socketUrl + '/room/id/' + roomId, { headers: this.headers });
  }

  addChat(roomId, data) {
    let body = JSON.stringify(data);
    return this.http.post(this.socketUrl + '/room/id/' + roomId, body, { headers: this.headers });
  }

  addImageChat(roomId, body) {
    let headers = new HttpHeaders({
      'Authorization': "Bearer Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.6_WA3xB6j192aWBYAub9AmvzJ3m9XhRA7h2t0_STPu4"
    });
    return this.http.post(this.socketUrl + '/room/id/' + roomId, body, { headers: headers });
  }

  readChat(roomId) {
    let body: any = JSON.stringify({ "userId": parseInt(this.user.user_id) });
    return this.http.post(this.socketUrl + '/room/read/' + roomId + '/' + this.user.user_id, body, { headers: this.headers });
  }

  joinRoom(roomId) {
    let body = JSON.stringify({
      "agronomis": this.user.user_id
    })
    return this.http.put(this.socketUrl + '/room/id/' + roomId, body, { headers: this.headers });
  }

}
