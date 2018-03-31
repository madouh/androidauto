import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {User} from "../../models/user"
import { AngularFireAuth } from 'angularfire2/auth';
import {LoginPage} from '../../pages/login/login'


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {
  user={} as User;
  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController) {
    try{ 
    const result=this.afAuth.auth.signOut()
     //this.navCtrl.push(LoginPage)
  }
  catch(e){
    console.error(e)
  }
}

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }


  

}