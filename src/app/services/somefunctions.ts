import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home'

@Injectable()
export class GotoPage {
    constructor(public navCtrl: NavController) {
                this.navCtrl.push(HomePage)
  

  }
  gotoHome(){
      this.navCtrl.push(HomePage)
  }

}