import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { JointdetailsPage } from '../../pages/jointdetails/jointdetails';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  term:string
  jointinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
   products:  AfoListObservable<any[]>;
   selectedItem;
   item
   itemEntered
   jointArray=[]
   resultArray=[]
   fromsearchWord:boolean;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.products = this.afoDatabase.list('/invoices');
    this.fromsearchWord=false;
    this.notifications = this.afoDatabase.list('/notifications');
    this.item=this.navParams.get('item')
    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
  if (this.platform.is('android')) {        
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
          // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    }
  }

searchWord(itemEntered){
  this.resultArray=[];
  if(itemEntered.length>=2){
    this.fromsearchWord=true;
    this.products.subscribe(snapshots=>{
          snapshots.forEach(snapshot => {
            if(snapshot.name.includes(itemEntered)){
              this.resultArray.push(snapshot)
              console.log(snapshot)
            }
            // this.jointArray.push(snapshot);
          });
            console.log(this.resultArray);
      })
      // this.navCtrl.push(SearchPage, {
      //   item: itemEntered
      // });
}
}
}