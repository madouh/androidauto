import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {ModalPage} from '../../pages/modal/modal';
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
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  term:string
  items:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
   editor:string;
   notifications:  AfoListObservable<any[]>;

  constructor(public modalcrtl:ModalController,public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.items = this.afoDatabase.list('/items'); 
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

  openModal(){
    const myData={
      name:"Mamdouh",
      occupation:"Engineer"
    }
    const myModal=this.modalcrtl.create(ModalPage,{data:myData});
    myModal.present();
  }

gotoHome(){
    this.navCtrl.push(HomePage)
  }

  addItem(){
  let prompt = this.alertCtrl.create({
    title: 'إدخال صنف ',
    message: "أدخل اسم الصنف و أقل عدد  ",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف'
      },
    {
        name: 'number',
        placeholder: 'اقل عدد'
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
              subTitle: 'لا يمكن ان يكون اسم الصنف  خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.items.push({
            name: data.name,number:data.number
          })
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
        text: 'حذف',
        role: 'destructive',
        handler: () => {
          this.removeItem(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateItem(item);
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
updateItem(item){
  let prompt = this.alertCtrl.create({
    title: 'تعديل صنف ',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف',
        value: item.name
      },
   
    {
        name: 'number',
        placeholder: 'أقل عدد',
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
              subTitle: 'لا يمكن ان يكون اسم الصنف  خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.items.update(item.$key ,{name: data.name,number: data.number})
            
        }
      }
    ]
  });
  prompt.present();
}

removeItem(item){
    this.items.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف"
          })
          );
}
}