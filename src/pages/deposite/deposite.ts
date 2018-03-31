
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
  selector: 'page-deposite',
  templateUrl: 'deposite.html',
})
export class DepositePage {

  term:string
  admins:  AfoListObservable<any[]>;
  providers: AfoListObservable<any[]>;
   editor:string;
   notifications:  AfoListObservable<any[]>;

  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.providers = this.afoDatabase.list('/contacts'); 
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

  addDeposite(){
  let prompt = this.alertCtrl.create({
    title: 'إدخال أساس الدين ',
    message: "أدخل اسم المورد و المبلغ المستحق له.",
    inputs: [
      {
        name: 'provider',
        placeholder: 'اسم المورد'
      },
    {
        name: 'deposite',
        placeholder: 'مبلغ الدين'
      },
    ],
    buttons: [
      {
        text: 'ألغاء',
        handler: data => {
          // console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
         if(data.deposite==""){
            data.deposite=0
        }
        if(data.provider==""){
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم المورد  خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.providers.push({
            provider: data.provider,deposite:data.deposite
          }).then(
            this.notifications.push({
            text: data.provider,deposite:data.deposite,action:"إضافة",class:"اساس الدين"
          })
          );
        }
      }
    ]
  });
  prompt.present();
}

 showOptions(item) {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'ماذا تريد أن تفعل؟',
    buttons: [
      {
        text: 'تعديل',
        handler: () => {
          this.updateDeposite(item);
        }
      },{
        text: 'إلغاء',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
}
/*https://developers.facebook.com/apps/779469925512432/fb-login/settings/*/
updateDeposite(item){
  let prompt = this.alertCtrl.create({
    title: 'تعديل أساس الدين',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'provider',
        placeholder: 'اسم المورد',
        value: item.name
      },
   
    {
        name: 'deposite',
        placeholder: 'فيمة الدين',
        value: item.deposite
      },
    ],
    buttons: [
      {
        text: 'إلغاء',
        handler: data => {
          // console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
            if(data.deposite==""){
            data.deposite=0
        }
        if(data.provider==""){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم المورد  خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.providers.update(item.$key ,{provider: data.provider,deposite: data.deposite}).then(
            this.notifications.push({
            text: data.provider,deposite:data.deposite,action:"تعديل",class:"اساس الدين"
          })
          );
        }
      }
    ]
  });
  prompt.present();
}

// removeProduct(item){
//     this.deposites.remove(item.$key).then(
//             this.notifications.push({
//             text: item.provider,deposite:item.deposite,action:"حذف",class:"اساس الدين"
//           })
//           );
// }
}