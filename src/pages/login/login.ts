import { Component } from '@angular/core';
import { ToastController,NavController, NavParams } from 'ionic-angular';
import {User} from "../../models/user"
import { AngularFireAuth } from 'angularfire2/auth';
import {HomePage} from "../../pages/home/home"
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user={} as User;
  
  constructor(private toast:ToastController,private afAuth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user:User){
  try{ 
    const result=this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password).then(data =>{
    // this.userLoggedIn=true;
    this.navCtrl.push(HomePage)
    })
  }
  catch(e){
    // this.navCtrl.push(LoginPage)
    console.error(e)
  }
  }

}
