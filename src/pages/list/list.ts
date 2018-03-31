import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  term:string
  orders:  AfoListObservable<any[]>;
    admins: AfoListObservable<any[]>;
   editor:string;
    notifications:  AfoListObservable<any[]>;


  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth ,public actionSheetCtrl:ActionSheetController,public navCtrl: NavController, public alertCtrl: AlertController,af: AngularFireDatabase) {
  this.orders = this.afoDatabase.list('/orders');
   this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
         this.notifications = this.afoDatabase.list('/notifications');

         if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
}

// gotoHome(){
//   this.navCtrl.push(HomePage)
// }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad AcessoirPage');
  }

 showOptions(item) {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'ماذا تريد أن تفعل؟',
    buttons: [
      {
        text: 'حذف',
        role: 'destructive',
        handler: () => {
          this.removeProduct(item);
        }
      },{
        text: 'إلغاء',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
}
/*https://developers.facebook.com/apps/779469925512432/fb-login/settings/*/

removeProduct(item){
 var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
    this.orders.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف",class:item.class,orderDate:orderDate,orderTime:orderTime
          })
          );
}
}