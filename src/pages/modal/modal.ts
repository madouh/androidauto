import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { NavController, NavParams,ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})

export class ModalPage {
 mydata
 resultArray=[]
 term:string
  items:  AfoListObservable<any[]>;
  showList:boolean;
  item
  price
  number
  constructor(public modalcrtl:ModalController,public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public viewcrtk:ViewController,public navCtrl: NavController, public navParams: NavParams) {
        this.showList=false;
        this.mydata=this.navParams.get('data')
        this.items = this.afoDatabase.list('/items'); 
  }

  ionViewWillLoad() {
    // this.mydata=this.navParams.get('data')
    // console.log(this.mydata);
  }

  showItem(){
      // this.showList=true;
  }

  bindValue(result){
    this.item=result;
  }

searchWord(itemEntered){
    if(itemEntered.length>1 && itemEntered.length<5){
      this.showList=true;
    }else{
      this.showList=false;
    }
    this.resultArray=[];
    if(itemEntered.length>=2){
      this.items.subscribe(snapshots=>{
            snapshots.forEach(snapshot => {
              if(snapshot.name.includes(itemEntered)){
                this.resultArray.push(snapshot)
              }
            });
        })
  }
}

closeModal(){
  this.viewcrtk.dismiss();
}

controlNumber(){

}

controlPrice(){

}

}
