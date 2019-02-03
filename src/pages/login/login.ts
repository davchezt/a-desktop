import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string ='';
  password: string ='';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private common: Common,
    private api: Api
  ) {
  }

  ionViewDidLoad() {
    
  }

  login() {
    if (
      this.username.length == 0 ||
      this.password.length == 0
    ) {
      this.common.presentToast("Semua bidang wajib di isi");
      return;
    }
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('username', this.username);
    postData.append('password', this.password);
    postData.append('login', "true");

    this.api.post('v1/user/login-adm', postData).subscribe(data => {
      let response:any = data;
      if (response.user_data) {
        this.events.publish('user:login', response.user_data);
      }
      else {
        this.common.presentToast(response.data);
        if (this.common.isShowLoading) this.common.closeLoading();
      }
    }, err => {
      console.log(err);
      if (this.common.isShowLoading) this.common.closeLoading();
    })
  }

}
