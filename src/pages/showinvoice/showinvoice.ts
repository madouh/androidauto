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
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-showinvoice',
  templateUrl: 'showinvoice.html',
})
export class ShowinvoicePage {
 invoiceKey;
 lastdept=0.0;
  invoice: FirebaseListObservable<any[]>;
  invoicesTableForOneProvider: FirebaseListObservable<any[]>;
  theSumOfInvoice=0;
  provider;
  paid;
  date;

 constructor(public platform: Platform,private screenOrientation: ScreenOrientation,
    private localNotifications: LocalNotifications,
    private afoDatabase:AngularFireOfflineDatabase ,
    public alertCtrl: AlertController,
    af: AngularFireDatabase,
     public navParams: NavParams,
      public navCtrl: NavController,
       afDB: AngularFireDatabase,
        public actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth) {   
      this.invoiceKey=this.navParams.get('invoiceKey')
      this.provider=this.navParams.get('provider')
      this.paid=this.navParams.get('paid')
      this.date=this.navParams.get('date')
      // console.log(this.invoiceKey)
  //  if (this.platform.is('android')) {        
  //       this.screenOrientation.unlock();
  //       // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
  //     }
  // }

    this.invoicesTableForOneProvider=afDB.list("/invoicesTable",{
      query: {
         orderByChild: 'provider',
        equalTo: this.provider
      }
    })

    this.invoicesTableForOneProvider.forEach(data => {
      this.lastdept=0.0;
  data.forEach(item => {
  this.lastdept = this.lastdept + (item.sum-item.paid);
  console.log(this.lastdept)

  });
    // this.invoicesTable.update(this.invoiceKey ,{provider:this.provider,sum:this.theSumOfInvoice,paid:this.paid,invoicedate:this.invoicedate.toLocaleDateString() })

});
  this.invoice = afDB.list('/invoices', {
      query: {
         orderByChild: 'invoiceKey',
        equalTo: this.invoiceKey
      }
    }); 

    this.invoice.subscribe(data => {
      this.theSumOfInvoice=0.0;
  data.forEach(item => {
    // console.log(item)
  this.theSumOfInvoice = this.theSumOfInvoice + item.num*item.price;
  });
  
});
  }


}
