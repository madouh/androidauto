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
  selector: 'page-beltsinfo',
  templateUrl: 'beltsinfo.html',
})
export class BeltsinfoPage {
 term:string
  beltsinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.beltsinfo = this.afoDatabase.list('/beltsinfo'); 
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
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BearingPage');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }
   
  addBeltInfo(){
   var orderDate: String = new Date().toLocaleDateString();
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات سير',
    message: "أدخل مقاس السير و بياناته و سعره",
    inputs: [
      {
        name: 'no',
        placeholder: 'مقاس السير '
      },
    {
        name: 'price',
        placeholder: 'سعر السير'
      },
    {
        name: 'notes',
        placeholder: 'ملاحظات'
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
           if(data.no==""||data.price==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون أي بيان خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.beltsinfo.push({
            no:data.no,price:data.price,notes:data.notes,selldate:orderDate
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
          this.removeProduct(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateBearingInfo(item);
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
updateBearingInfo(item){
  var orderDate: String = new Date().toLocaleDateString();
  let prompt = this.alertCtrl.create({
    title: 'تعديل عملية بيع',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'no',
        placeholder: 'مقاس السير ',
        value: item.no
      },
      {
        name: 'price',
        placeholder: 'سعر السير',
        value: item.price
      },
   
    {
        name: 'notes',
        placeholder: 'ملاظات',
        value: item.notes
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
           if(data.no==""||data.inner==""||data.outer==""||data.thickness==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون أي بيان خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.beltsinfo.update(item.$key ,{no:data.no,price: data.price,notes: data.notes,selldate:orderDate })
        }
      }
    ]
  });
  prompt.present();
}

removeProduct(item){
    this.beltsinfo.remove(item.$key).then(
            this.notifications.push({
            text: item.no,action:"حذف",class:"بيانات السيور"
          })
          );;
}
}
