import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content, Navbar, Events, Platform } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { SocketProvider } from '../../providers/socket/socket';
import { FeedProvider } from '../../providers/feed/feed';

@Component({
  selector: 'page-room-chat',
  templateUrl: 'room-chat.html',
})
export class RoomChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild("messageInput") messageInput;
  @ViewChild("footerInput") footerInput;
  @ViewChild('navbar') navBar: Navbar;

  reqJoinRoom: boolean = false;
  isReader: boolean = false;
  showEmojiPicker = false;
  isPetaniTyping: boolean = false;
  roomId: any = null;
  typingMessage: any;
  message: string = "";
  file: any = "";
  onMessage: any;
  onRoom: any;
  outRoom: any;
  onStartTyping: any;
  onStopTyping: any;

  petani: any = { name: null };
  user: any = { user_id: null };
  subject: any = null;
  created: any  = null;
  chats: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ref: ChangeDetectorRef,
    public events: Events,
    public common: Common,
    public apiService: Api,
    private platform: Platform,
    private dataServices: DataProvider,
    private socketServices: SocketProvider,
    private feed: FeedProvider
  ) {
    this.reqJoinRoom = this.navParams.get('join') ? true:false;
    this.roomId = this.navParams.get('roomId');
    this.user = this.dataServices.user;
    this.user.user_id = parseInt(this.user.user_id);

    if (this.platform.is("android")) {
      window.addEventListener("native.keyboardshow", e => {
        this.footerInput.nativeElement.style.bottom =
          (<any>e).keyboardHeight + "px";
      });

      window.addEventListener("native.keyboardhide", () => {
        this.footerInput.nativeElement.style.bottom = "56px";
      });
    }

  }

  ionViewDidLoad() {
    this.onMessage = this.socketServices.on('message').subscribe(data => {
      let chat:any = data;
      if (chat.chat) {
        this.chats.push(chat.chat);
        this.scrollBottom();
      }
    });
    this.onRoom = this.socketServices.on('in-room').subscribe(data => {
      let result:any = data;
      this.isReader = result.room.length === 2 ? true : false;
      if (this.isReader) this.readMessage();
      // console.log("room-chat:in-room:", result.room, "isReader:", this.isReader);
    });
    this.outRoom = this.socketServices.on('out-room').subscribe(data => {
      let result:any = data;
      this.isReader = result.room.length === 2 ? true : false;
      console.log("room-chat:out-room:", result.room, "isReader:", this.isReader);
    });
    this.onStartTyping = this.socketServices.on('start-typing').subscribe(data => {
      let message:any = data;
      if (message.user.toString() === this.petani.id.toString()) {
        // console.log('start-typing');
        this.isPetaniTyping = true;
      }
    });
    this.onStopTyping = this.socketServices.on('stop-typing').subscribe(data => {
      let message:any = data;
      if (message.user.toString() === this.petani.id.toString()) {
        // console.log('stop-typing');
        this.isPetaniTyping = false;
      }
    });
    this.events.subscribe('user:online', () => {
      this.petani.online = this.dataServices.isOnline(parseInt(this.petani.id));
    });
    this.events.subscribe('user:offline', () => {
      this.petani.online = this.dataServices.isOnline(parseInt(this.petani.id));
      this.isPetaniTyping = false;
    });
    this.getRoom();
    this.readChat();
    if (this.joinRoom) {
      // update database
      this.joinRoom();
    }
    this.navBar.backButtonClick = (ev:UIEvent) => {
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")(this.navParams.get('callbackData'));
      });
    }
  }

  ionViewWillLeave() {
    this.socketServices.emit('out-room', {
      room: this.roomId,
      userId: this.user.user_id
    });
    this.socketServices.emit('stop-typing', { room: this.roomId, form: this.user.user_id });
    this.onMessage.unsubscribe();
    this.onRoom.unsubscribe();
    this.outRoom.unsubscribe();
    this.onStartTyping.unsubscribe();
    this.onStopTyping.unsubscribe();
  }

  dismiss() {
    this.navCtrl.pop().then(() => {
      this.navParams.get("callback")();
    });
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      setTimeout(() => {
        //this.focus();
        this.content.resize();
        this.scrollBottom();
      }, 100);
    }
  }

  setFocus() {
    this.footerInput.focus();
  }

  scrollBottom() {
    var that = this;
    this.content.resize();
    setTimeout(function() {
      if (that.content) {
        that.content.scrollToBottom();
      }
    }, 300);
  }

  isTyping(event) {
    if (event.keyCode == 13) return;

    this.socketServices.emit('start-typing', { room: this.roomId, form: this.user.user_id });
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }
    this.typingMessage = setTimeout(() => {
      this.socketServices.emit('stop-typing', { room: this.roomId, form: this.user.user_id });
    }, 2000);
  }

  getRoom() {
    this.dataServices.getChat(this.roomId)
    .subscribe(data => {
      let room:any = data;
      this.subject = room.subject;
      this.created = room.created;
      this.chats = room.chat;
      this.chats.reverse();
      this.dataServices.getAgronomis(room.petani).subscribe(user => {
        this.petani = user;
        this.petani.online = this.dataServices.isOnline(room.petani);
        // FEEDS
        if (this.reqJoinRoom) this.sendAnswerRoomFeed();
      });
      if (this.chats.length >= 5) {
        this.scrollBottom();
      }
    }, error => {
      console.log(error);
    });
  }

  joinRoom() {
    this.dataServices.joinRoom(this.roomId).subscribe(data => {
      let response:any = data;
      console.log(response);
      this.socketServices.joinRoom(this.roomId);
    }, error => {
      console.log(error);
    });
  }

  sendMessage() {
    this.messageInput.setBlur();
    this.postMessage();
    this.message = '';
    this.socketServices.emit('stop-typing', { room: this.roomId, from: this.user.user_id });

    this.scrollBottom();
  }

  postMessage() {
    let data:any = {
      "from": this.user.user_id,
      "text": this.message,
      "read": this.isReader
    };
    if (this.file) {
      let body = new FormData();
      body.append("from", this.user.user_id);
      body.append("text", this.message);
      body.append("read", this.isReader ? "true":"false");
      body.append("image", this.file);
  
      this.dataServices.addImageChat(this.roomId, body)
      .subscribe(data => {
        // console.log(data);
        this.file = "";
        // FEEDS
        if (!this.isReader) this.sendNewMessageFeed();
      }, err => {
        console.log(err);
      });

      return;
    }
    this.dataServices.addChat(this.roomId, data)
    .subscribe(data => {
      // console.log(data);
      // FEEDS
      if (!this.isReader) this.sendNewMessageFeed();
    }, err => {
      console.log(err);
    });
  }

  sendNewMessageFeed() {
    let message = "mengirim pesan baru";
    this.feed.addFeed(this.petani.id, message, this.roomId, "Chat").subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  sendAnswerRoomFeed() {
    let message = "bersedia menjawab chat anda";
    this.feed.addFeed(this.petani.id, message, this.roomId, "Chat").subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  readChat() {
    this.dataServices.readChat(this.roomId).subscribe(data => {
      // console.log(data);
      this.socketServices.emit('in-room', {
        room: this.roomId,
        userId: this.user.user_id
      });
    }, err => {
      console.log(err);
    })
  }

  readMessage() {
    var that = this;
    Object.keys(this.chats).forEach(function(id) {
      that.chats[id].read = true;
      // console.log(that.chats[id].read);
    });
  }

  doRefresh(refresher) {
    this.chats = [];
    this.getRoom();
    refresher.complete();
  }

  onKeypress(event) {
    if (event.inputType == 'insertLineBreak') {
      return;
    }
    if (event.keyCode == 13) console.log("enter");
    // console.log("keypress ", event);
  }

  changeListener($event) : void {
    this.file = $event.target.files[0];
    // console.log(this.file);
  }

  clearFile() {
    this.file = "";
  }

}
