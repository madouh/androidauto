import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home'
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-mallaky',
  templateUrl: 'mallaky.html',
})
export class MallakyPage {
   term:string
    orders:  AfoListObservable<any[]>;
    admins: AfoListObservable<any[]>;
    notifications:  AfoListObservable<any[]>;

  editor:string;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public actionSheetCtrl:ActionSheetController, public alertCtrl: AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    this.orders = this.afoDatabase.list('/orders', {
      query: {
        orderByChild: 'class',
        equalTo: "mallaky" 
      }
    });
    
         if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
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
  }

gotoHome(){
  this.navCtrl.push(HomePage)
}

  addMallakyOrder(){
     var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
  let prompt = this.alertCtrl.create({
    title: 'إدخال بند ناقص',
    message: "أدخل اسم الصنف و العدد الموجود منه",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف'
      },
    {
        name: 'number',
        placeholder: 'العدد الموجود'
      },
      
    ],
    buttons: [
      {
        text: 'ألغاء',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
            if(data.number==""){
            data.number=0
        }
        if(data.name==""){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
        
          this.orders.push({
            name: data.name,number:data.number,class:"mallaky",orderDate:orderDate,orderTime:orderTime
          }).then(
            this.notifications.push({
            text: data.name,number:data.number,action:"اضافة",class:"ملاكي",orderDate:orderDate,orderTime:orderTime
          })
          );
        }
      }
    ]
  });

  prompt.present();
}


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
        text: 'تعديل',
        handler: () => {
          this.updateProduct(item);
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
updateProduct(item){
   var orderDate: String = new Date().toLocaleDateString();
  var orderTime: String = new Date().toLocaleTimeString();
  let prompt = this.alertCtrl.create({
    title: 'تعديل عملية بيع',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف',
        value: item.name
      },
   
    {
        name: 'number',
        placeholder: 'عدد',
        value: item.number
      },
    ],
    buttons: [
      {
        text: 'إلغاء',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
            if(data.number==""){
            data.number=0
        }
        if(data.name==""){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.orders.update(item.$key ,{name: data.name,number: data.number}).then(
            this.notifications.push({
            text: data.name,number:data.number,action:"تعديل",class:"ملاكي",orderDate:orderDate,orderTime:orderTime
          })
          );
        }
      }
    ]
  });
  prompt.present();
}

removeProduct(item){
   var orderDate: String = new Date().toLocaleDateString();
  var orderTime: String = new Date().toLocaleTimeString();
  this.orders.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف",class:"ملاكي",orderDate:orderDate,orderTime:orderTime
          })
          );
}



}

