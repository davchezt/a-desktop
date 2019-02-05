import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';

declare var SimplePeer;

@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  @ViewChild('rtcVideo') rtcVideo;
  @ViewChild('locVideo') locVideo;

  cameraStream: any;
  targetPeer: any;
  peer: any;
  n = <any>navigator;
  isCaller: boolean = false;
  isConnected: boolean = false;
  isInit: boolean = false;
  stream: any = null;
  roomId = "vidoe-call";
  playPromise: any;
  smileShow: boolean = false;
  heartShow: boolean = false;
  timeOut: any;

  timeInterval: any;
  timeCounter: any;
  timeClock: any;
  h:number = 0;
  m:number = 0;
  s:number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public socket: Socket,
    private storage: Storage
  ) {
    if (this.navParams.get('caller')) console.log('ya');

    this.storage.get('userData').then((data) => {
      if (data) {
        let userData = JSON.parse(data);
        userData.user_id = parseInt(userData.user_id);
        this.roomId = this.roomId + "-" + userData.user_id;
        console.log(this.roomId);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  ionViewDidLoad() {
    this.startAnu();
    this.timeNow();
    console.log(this.roomId);
  }

  startAnu() {
    this.isCaller = this.navParams.get('caller') ? true : false;
    this.socket.connect();
    this.socket.emit('subscribe', this.roomId);
    this.socket.on('start-call', (data) => {
      let peer:any = data;
      if (peer.data.type === 'offer') {
        if (!this.isCaller) {
          console.log('offer:', peer.data);
          if (!this.isCaller) this.init();
          this.targetPeer = JSON.stringify(peer.data);
        }
      }
      else {
        if (this.isCaller) {
          console.log('answer:', peer.data);
          this.targetPeer = JSON.stringify(peer.data);
          if (this.peer) this.peer.signal(JSON.parse(this.targetPeer));
        }
      }
    })
    this.socket.on('in-call', (data) => {
      this.isConnected = true;
      this.isInit = false;
      this.startTimer();
    });
    this.socket.on('chat-call', (data) => {
      let peer:any = data;
      console.log(peer.message);
      if (this.isCaller) {
        if(!peer.message.sender) {
          if (peer.message.text == 'ping') {
            if (this.timeOut) clearTimeout(this.timeOut);
            this.smileShow = false;
            this.heartShow = false;
            this.showSmile();
          }
          else {
            if (this.timeOut) clearTimeout(this.timeOut);
            this.smileShow = false;
            this.heartShow = false;
            this.showHeart();
          }
        }
      }
      else {
        if(peer.message.sender) {
          if (peer.message.text == 'ping') {
            if (this.timeOut) clearTimeout(this.timeOut);
            this.smileShow = false;
            this.heartShow = false;
            this.showSmile();
          }
          else {
            if (this.timeOut) clearTimeout(this.timeOut);
            this.smileShow = false;
            this.heartShow = false;
            this.showHeart();
          }
        }
      }
    });
    this.socket.on('stop-call', (data) => {
      this.isConnected = false;
      this.targetPeer = null;
      this.stropTimer();
    });

    // if (!this.isCaller) this.init();
  }

  init() {
    this.isInit = true;
    this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    this.n.getUserMedia({ video:true, audio:true }, (stream) => {
      this.cameraStream = stream;
      if (!this.locVideo.nativeElement.srcObject) this.locVideo.nativeElement.srcObject = this.cameraStream;
      this.playPromise = this.locVideo.nativeElement.play();
      this.peer = new SimplePeer({
        initiator: this.isCaller,
        trickle: false,
        stream: this.cameraStream,
        iceTransportPolicy: "relay",
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            // {
            //   url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            //   credential: 'webrtc',
            //   username: 'webrtc'
            // },
            // {
            //   url: 'stun:numb.viagenie.ca',
            //   credential: '4Bahagia4',
            //   username: 'davchezt@gmail.com'
            // },
            // {
            //   url: 'turn:numb.viagenie.ca',
            //   credential: '4Bahagia4',
            //   username: 'davchezt@gmail.com'
            // }
          ]
        }
      })

      this.peer.on('connect', () => {
        this.socket.emit('in-call', { room: this.roomId });
        console.log("peer connect");
        console.log("isConnected: ", this.isConnected)
      })
      
      this.peer.on('signal', (data) => {
        // console.log('signal:', JSON.stringify(data));

        this.socket.emit('start-call', { room: this.roomId, data: data });
      })
      
      this.peer.on('data', (data) => {
        var buffer = data;
        console.log(buffer.toString());
      })
      
      this.peer.on('stream', (streams) => {
        var isPlaying = this.rtcVideo.nativeElement.currentTime > 0 &&
          !this.rtcVideo.nativeElement.paused &&
          !this.rtcVideo.nativeElement.ended &&
          this.rtcVideo.nativeElement.readyState > 2;
          
        this.rtcVideo.nativeElement.srcObject = streams;
        if (!isPlaying) this.rtcVideo.nativeElement.play();
      });

      this.peer.on('close', () => {
        console.log("peer close");
        this.socket.emit('stop-call', { room: this.roomId });
        this.disconnect();

        stream.getVideoTracks().forEach(function(track) {
          track.stop();
        });
        stream.getAudioTracks().forEach(function(track) {
          track.stop();
        });
        if (this.cameraStream) {
          this.cameraStream.getVideoTracks().forEach(function(track) {
            track.stop();
          });
          this.cameraStream.getAudioTracks().forEach(function(track) {
            track.stop();
          });
        }
        this.cameraStream = null;
      });

      this.peer.on('error', (err) => {
        console.log(err);
        this.targetPeer = null;
        this.isConnected = false;
      });

    }, function(err){
      console.log('Failed to get stream', err);
    });
    
  }

  connect() {
    if (this.peer) {
      this.peer.signal(JSON.parse(this.targetPeer));
    }
  }

  message() {
    if (this.peer) {
      // this.peer.send("ping!");
      this.socket.emit('chat-call', { room: this.roomId, message: { text: "heart", sender: this.isCaller }});
    }
  }
  
  sendMessage() {
    if (this.peer) {
      // this.peer.send(this.message);
      this.socket.emit('chat-call', { room: this.roomId, message: { text: "ping", sender: this.isCaller }});
    }
  }

  disconnect() {
    if (this.peer) {
      this.locVideo.nativeElement.srcObject = null;
      if (this.playPromise !== undefined) {
        this.playPromise.then(_ => {
          // this.rtcVideo.nativeElement.pause();
          this.rtcVideo.nativeElement.srcObject = null;
        })
        .catch(error => {
          console.log(error)
        });
      }

      this.peer.destroy();
      this.peer = null;
      this.targetPeer = null;
      // if (!this.isCaller) this.init();
    }
  }

  showSmile() {
    this.smileShow = true;
    this.timeOut = setTimeout(() => {
      this.smileShow = false;
    }, 5000);
  }

  showHeart() {
    this.heartShow = true;
    this.timeOut = setTimeout(() => {
      this.heartShow = false;
    }, 5000);
  }

  startTimer() {
    if (this.timeInterval) return;
    this.timeInterval = setInterval(() => {
      this.s++;
      if (this.s >= 60) {
        this.s = 0; this.m++;
      }
      if (this.m >= 60) {
        this.m = 0; this.h++;
      }
      let dm = this.m < 10 ? "0" + this.m:this.m;
      let ds = this.s < 10 ? "0" + this.s:this.s;
      this.timeCounter = this.h + ":" + dm + ":" + ds;
    }, 1000);
  }

  stropTimer() {
    this.timeCounter = null;
    this.h = 0;
    this.m = 0;
    this.s = 0;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  timeNow() {
    setInterval(() => {
      let date = new Date();
      let time = date.getTime() / 1000;
      this.timeClock = this.getHHMM(time);
    }, 1000);
  }


  getHHMM = (t: number) => {
    let d = new Date(t * 1000);
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let a = "";
    let ms = "";
    let ss = "";
    if (h > 0 && h < 12) {
      a = "AM";
    } else {
      if (h == 0) a = "AM";
      else a = "PM";
    }
    if (m < 10) ms = "0" + m;
    else ms = "" + m;
    if (s < 10) ss = "0" + s;
    else ss = "" + s;
    return (h == 0 || h == 12 ? 12 : h % 12) + ":" + ms + ":" + ss + " " + a;
  };

}