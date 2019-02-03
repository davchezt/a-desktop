import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = AboutPage;
  tab2Root = SettingsPage;

  @ViewChild("dTabs") tabRef: Tabs;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let openTab = this.navParams.get("openTab");
    if (openTab) {
      this.tabRef.select(openTab)
    }
  }

}
