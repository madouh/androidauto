import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  term:string
  orders: FirebaseListObservable<any>;
  constructor(public actionSheetCtrl:ActionSheetController,public navCtrl: NavController, public alertCtrl: AlertController,af: AngularFireDatabase) {
  this.orders = af.list('/orders');
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
          this.removeProduct(item.$key);
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

removeProduct(id){
  console.log(id)
  this.orders.remove(id);
}
}