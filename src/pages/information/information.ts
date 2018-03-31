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
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {

   term:string
    // orders:  AfoListObservable<any[]>;
    admins: AfoListObservable<any[]>;
    notifications:  AfoListObservable<any[]>;
    informations:  AfoListObservable<any[]>;
    x=[]
  editor:string;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public actionSheetCtrl:ActionSheetController, public alertCtrl: AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    // this.orders = this.afoDatabase.list('/orders', {
    //   query: {
    //     orderByChild: 'class',
    //     equalTo: "informations" 
    //   }
    // });
    
     this.informations = this.afoDatabase.list('/informations', { preserveSnapshot: true});
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

gotoHome(){
  this.navCtrl.push(HomePage)
}

  addInformationOrder(){
  let prompt = this.alertCtrl.create({
    title: 'إدخال معلومة',
    message: "فضلاً ادلخل قطعة الغيار و المعلومة",
    inputs: [
      {
        name: 'name',
        placeholder: 'الاسم '
      },
    {
        name: 'info',
        placeholder: 'المعلومة'
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
        if(data.name=="" ||data.info==""){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون الاسم أو المعلومة خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
        
          this.informations.push({
            name: data.name,info:data.info,class:"informations"
          }).then(
            this.notifications.push({
            text: data.name,info:data.info,action:"اضافة",class:"معلومات"
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
      // this.orders.subscribe(snapshots=>{
      //   snapshots.forEach(snapshot => {
      //     this.removeProduct(snapshot)
          // this.informations.push({name:snapshot.name,info:snapshot.info})
      //   }); 
      // })
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
  let prompt = this.alertCtrl.create({
    title: 'تعديل معلومة',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'name',
        placeholder: 'الاسم ',
        value: item.name
      },
   
    {
        name: 'info',
        placeholder: 'المعلومة',
        value: item.info
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
        if(data.name==""||data.info==""){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون الاسم أو المعلومة خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.informations.update(item.$key ,{name: data.name,info: data.info}).then(
            this.notifications.push({
            text: data.name,info:data.info,action:"تعديل",class:"معلومات"
          })
          );
        }
      }
    ]
  });
  prompt.present();
}

removeProduct(item){
  this.informations.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف",class:"معلومات"
                   })
          );
}

}