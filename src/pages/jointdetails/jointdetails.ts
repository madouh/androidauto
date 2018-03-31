import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-jointdetails',
  templateUrl: 'jointdetails.html',
})
export class JointdetailsPage {
  joint
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,public navCtrl: NavController, public navParams: NavParams) {
    this.joint=this.navParams.get('item')
   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JointdetailsPage');
  }
}