import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {ShowinvoicePage} from '../../pages/showinvoice/showinvoice';
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
  selector: 'page-invoices',
  templateUrl: 'invoices.html',
})
export class InvoicesPage {
  term:string
  orders:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
   editor:string;
   notifications:  AfoListObservable<any[]>;
   invoicestable:  AfoListObservable<any[]>;
   invoices:  AfoListObservable<any[]>;
   invoicesToDelete:  AfoListObservable<any[]>;

  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.invoicestable = this.afoDatabase.list('/invoicesTable',{
      query: {
        orderByChild: 'invoicedate'
            }
    }); 
    this.invoices = this.afoDatabase.list('/invoices'); 
    this.notifications = this.afoDatabase.list('/notifications');

    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
    
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();

        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AklPage');
  }

gotoHome(){
    this.navCtrl.push(HomePage)
  }

 showOptions(item,provider,paid,date) {
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
        text: 'عرض',
        handler: () => {
          this.showDetails(item,provider,paid,date);
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

showDetails(invoice,provider,paid,date){
   // That's right, we're pushing to ourselves!
    this.navCtrl.push(ShowinvoicePage, {
      invoiceKey: invoice.$key,
      provider: provider,
      paid: paid,
      date: date,
      
    });
}

removeProduct(item){
     let alertConfirm = this.alertCtrl.create({
    title: 'تحذير من حذف فاتورة',
    message: 'هل انت متاكد من حذف هذة الفاتورة إذ لا يمكن التراجع عن هذا الحذف او استعادة الفاتورة',
    buttons: [
      {
        text: 'إلفاء',
        role: 'cancel',
        handler: () => {
          console.log('No clicked');
        }
      },
      {
        text: 'تأكيد',
        handler: () => {
            var deleteDate: String = new Date().toLocaleDateString();
            var deleteTime: String = new Date().toLocaleTimeString();
            this.invoicesToDelete=this.afoDatabase.list('/invoices', {
              query: {
                orderByChild: 'invoiceKey',
                equalTo: item.$key
              }
            }); 
            this.invoicesToDelete.forEach(element=>{
              element.forEach(e=>{
                this.invoicesToDelete.remove(e.$key)
              })
            })
          this.invoicestable.remove(item.$key)
          .then(
                  this.notifications.push({
                  text: item.provider,date:item.invoicedate,action:"حذف",class:"فواتير",deleteDate:deleteDate,deleteTime:deleteTime
                })
                );        }
            }
          ]
  });
  alertConfirm.present();
 }
}