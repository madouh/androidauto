import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-acessoir',
  templateUrl: 'acessoir.html',
})
export class AcessoirPage {
   term:string
  orders:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
  message;
  number;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private callNumber: CallNumber,private sms: SMS,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,public actionSheetCtrl:ActionSheetController, private afAuth:AngularFireAuth,public alertCtrl:AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {

    this.orders = this.afoDatabase.list('/orders', {
      query: {
        orderByChild: 'class',
        equalTo: "acessoir" 
      }
    });
         this.notifications = this.afoDatabase.list('/notifications');

    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
     if (this.platform.is('android')) {        
        this.screenOrientation.unlock();

        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
  }

 gotoHome(){
  this.navCtrl.push(HomePage)
}

 addAcessoirOrder(){
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
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف  خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.orders.push({
            name: data.name,number:data.number,class:"acessoir",orderDate:orderDate,orderTime:orderTime
          }).then(
            this.notifications.push({
            text: data.name,number:data.number,action:"اضافة",class:"كماليات",orderDate:orderDate,orderTime:orderTime
          })
          );
          //  this.localNotifications.schedule({
          //   text: "تمت إضافة + data.name + في نواقص الكماليات"
          // });
        }
      }
    ]
  });

  prompt.present();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaitPage');
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
                console.log(data);
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
            text: data.name,number:data.number,action:"تعديل",class:"كماليات",orderDate:orderDate,orderTime:orderTime
          })
          );
          this.localNotifications.schedule({
            text: " تم تعديل "+ data.name +" في نواقص الكماليات"
          });
        }
      }
    ]
  });
  prompt.present();
}

sendSms(number,message){
 this.sms.send(number, message);
}
callThisNumber(number){
this.callNumber.callNumber(number, true)
  .then(() => console.log('Launched dialer!'))
  .catch(() => console.log('Error launching dialer'));
}
removeProduct(item){
 var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
    this.orders.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف",class:"كماليات",orderDate:orderDate,orderTime:orderTime
          })
          );
}
}

