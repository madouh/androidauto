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
  selector: 'page-bearingsinfo',
  templateUrl: 'bearingsinfo.html',
})
export class BearingsinfoPage { 
  term:string
  bearinginfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
  // bearings=[]
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.bearinginfo = this.afoDatabase.list('/bearinginfo'); 
    this.notifications = this.afoDatabase.list('/notifications');

    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 

     if (this.platform.is('android')) {        
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
      
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
  //   this.bearings = [
  //   { no:'626' , inner: 6,outer:17,thickness:6 },
  //   { no:'607' , inner: 7,outer:19,thickness:6 },
  //   { no:'608' , inner: 8,outer:22,thickness:7 },
  //   { no:'609' , inner: 9,outer:24,thickness:7 },
  //   { no:'629' , inner: 9,outer:26,thickness:7 },
  //   { no:'6000' , inner: 10,outer:26,thickness:8 },
  //   { no:'627' , inner: 7,outer:22,thickness:7 },
  //   { no:'6001' , inner: 12,outer:28,thickness:8 },
  //   { no:'6002' , inner: 15,outer:32,thickness:9 },
  //   { no:'6003' , inner: 17,outer:35,thickness:10 },
  //   { no:'6004' , inner: 20,outer:42,thickness:12 },
  //   { no:'6005' , inner: 25,outer:47,thickness:12 },
  //   { no:'6006' , inner: 30,outer:55,thickness:13 },
  //   { no:'6007' , inner: 35,outer:62,thickness:14 },
  //   { no:'6200' , inner: 10,outer:30,thickness:9 },
  //   { no:'6201' , inner: 12,outer:32,thickness:10 },
  //   { no:'6202' , inner: 15,outer:35,thickness:11 },
  //   { no:'6203' , inner: 17,outer:40,thickness:12 },
  //   { no:'6204' , inner: 20,outer:47,thickness:14 },
  //   { no:'6205' , inner: 25,outer:52,thickness:15 },
  //   { no:'6206' , inner: 30,outer:62,thickness:16 },
  //   { no:'6207' , inner: 35,outer:72,thickness:17 },
  //   { no:'6208' , inner: 40,outer:80,thickness:18 },
  //   { no:'62201' , inner: 11,outer:32,thickness:15 },
  //   { no:'62202' , inner: 15,outer:35,thickness:18 },
  //   { no:'62205' , inner: 25,outer:52,thickness:18 },
  //   { no:'28/62' , inner: 28,outer:58,thickness:28 },
  //   { no:'638' , inner: 8,outer:28,thickness:7 },
  //   { no:'6301' , inner: 12,outer:37,thickness:12 },
  //   { no:'6302' , inner: 15,outer:42,thickness:13 },
  //   { no:'6303' , inner: 17,outer:47,thickness:14 },
  //   { no:'6304' , inner: 20,outer:52,thickness:15 },
  //   { no:'6305' , inner: 25,outer:62,thickness:17 },
  //   { no:'6306' , inner: 30,outer:72,thickness:18 },
  //   { no:'6307' , inner: 35,outer:80,thickness:18 },
  //   { no:'6308' , inner: 40,outer:90,thickness:18 },
  //   { no:'6309' , inner: 45,outer:100,thickness:25 },
  //   { no:'اكس خلفي 132' , inner: 30,outer:65,thickness:20 },
  //   { no:'6903' , inner: 17,outer:30,thickness:7 },
  //   { no:'6904' , inner: 20,outer:37,thickness:9 },
  //   { no:'17887/31' , inner: 45,outer:80,thickness:15 },
  //   { no:'B15-69' , inner: 15,outer:35,thickness:16 },
  //   { no:'B15-86/46' , inner: 15,outer:46,thickness:16 },
  //   { no:'B15-86/47' , inner: 15,outer:47,thickness:16 },
  //   { no:'B20' , inner: 20,outer:47,thickness:16 },
  //   { no:'B25' , inner: 25,outer:52,thickness:23.3 },
  //   { no:'B30' , inner: 30,outer:75,thickness:21 },
  //   { no:'B35' , inner: 35,outer:85,thickness:21 },
  //   { no:'B17/99' , inner: 17,outer:52,thickness:17 },
  //   { no:'40BD49' , inner: 17,outer:40,thickness:12 },
  //   { no:'B8-79' , inner: 8,outer:23,thickness:11 },
  //   { no:'B18' , inner: 18.5,outer:38,thickness:10 },
  //   { no:'63001' , inner: 12,outer:28,thickness:12 },
  //   { no:'6300' , inner: 10,outer:35,thickness:11 },
  //   { no:'28/63' , inner: 28,outer:68,thickness:18 },
  //   { no:'62304' , inner: 11,outer:52,thickness:21 },
  //   { no:'B22-19' , inner: 22,outer:62,thickness:17 },
  //   { no:'LM12749/11' , inner: 22,outer:46,thickness:12 },
  //   { no:'LM12749/10' , inner: 22,outer:45,thickness:12 },
  //   { no:'68149/111' , inner: 35,outer:60,thickness:12 },
  //   { no:'62/22' , inner: 36,outer:68,thickness:20 },
  //   { no:'6403' , inner: 17,outer:62,thickness:17 },
  //   { no:'285216 عجل هيونداي' , inner: 28,outer:52,thickness:12 },
  //   { no:'32005 عجل بيجو ص' , inner: 25,outer:47,thickness:12 },
  //   { no:'320/32 عجل بيجو ك' , inner: 32,outer:58,thickness:15 },
  //   { no:'11749 عجل لانوس ص' , inner: 17,outer:40,thickness:11 },
  //   { no:'45449 عجل لانوس ك' , inner: 29,outer:50,thickness:7 },
  //   { no:'LM67048/10' , inner: 32,outer:59,thickness:15 },
  //   { no:'LM11949' , inner: 19,outer:45,thickness:15 },
  //   { no:'LM49548' , inner: 35,outer:65,thickness:15 },
  //   { no:'LM12649' , inner: 21.4,outer:45,thickness:15 },
  //   { no:'32206' , inner: 30,outer:62,thickness:15 },
  //   { no:'32304' , inner: 20,outer:52,thickness:15 },
  //   { no:'30306' , inner: 30,outer:72,thickness:15 },
  //   { no:'30208' , inner: 40,outer:80,thickness:15 },
  //   { no:'30204' , inner: 20,outer:47,thickness:15 },
  //   { no:'30205' , inner: 25,outer:52,thickness:15 },
  //   { no:'8705' , inner: 26,outer:57,thickness:14 },
  //   { no:'32207' , inner: 25,outer:72,thickness:15 },
  //   { no:'30307' , inner: 35,outer:80,thickness:15 },
  //   { no:'02472' , inner: 28,outer:68,thickness:17.5 },
  //   { no:'HM803149' , inner: 44,outer:92,thickness:21 },
  //   { no:'469/453' , inner: 57,outer:105,thickness:25 },
  //   { no:'29586' , inner: 63.5,outer:108,thickness:19 },
  //   { no:'28580' , inner: 51,outer:92,thickness:21 },
  //   { no:'3384/20' , inner: 41,outer:80,thickness:24 },
  //   { no:'28985' , inner: 60,outer:101.5,thickness:20 },
  //   { no:'28584' , inner: 52,outer:92,thickness:20 },
  //   { no:'50KW3780' , inner: 50,outer:93,thickness:24 },
  //   { no:'32210' , inner: 50,outer:90,thickness:20 },
  //   { no:'32011' , inner: 55,outer:90,thickness:20 },
  //   { no:'30211' , inner: 50,outer:100,thickness:20 },
  //   { no:'6210' , inner: 50,outer:90,thickness:20 },
  //   { no:'6213' , inner: 65,outer:120,thickness:20 },
  //   { no:'3210' , inner: 50,outer:80,thickness:20 },
  //   { no:'دينامو سويفت ص' , inner: 15,outer:32,thickness:11 }
    
  // ]
// .subscribe(snapshots=>{
      //   snapshots.forEach(snapshot => {
      //     this.removeProduct(snapshot)
          // this.informations.push({name:snapshot.name,info:snapshot.info})
      //   }); 
      // })
  // this.bearings.forEach(e=>{
  //     this.bearinginfo.push({
  //           no:e.no,inner:e.inner,outer:e.outer,thickness:e.thickness
  //         })  
  // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BearingPage');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }
   
  addBearingInfo(){
     if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات  بلية',
    message: "أدخل رقم البلية و الداخلي و الخارجي و السمك",
    inputs: [
      {
        name: 'no',
        placeholder: 'رقم البلية'
      },
    {
        name: 'inner',
        placeholder: 'داخلي'
      },
    {
        name: 'outer',
        placeholder: 'خارجي'
      },
    {
        name: 'thickness',
        placeholder: 'السمك'
      },
      {
      name: 'notes',
        placeholder: 'ملاحظات او الاستخدام'
      },
      
    ],
    buttons: [
      {
        text: 'ألغاء',
        handler: data => {
          console.log('Cancel clicked');
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)

        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.no==""||data.inner==""||data.outer==""||data.thickness==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.bearinginfo.push({
            no:data.no,inner:data.inner,outer:data.outer,thickness:data.thickness,notes:data.notes
          }).then(
            //  if (this.platform.is('android')) {        
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    // }
         )
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
          this.removeBearing(item);
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
   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'تعديل بيانات بلية',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'no',
        placeholder: 'رقم البلية',
        value: item.no
      },
      {
        name: 'inner',
        placeholder: 'داخلي',
        value: item.inner
      },
   
    {
        name: 'outer',
        placeholder: 'خارجي',
        value: item.outer
      },
    {
        name: 'thickness',
        placeholder: 'سمك',
        value: item.thickness
      }, 
      {
        name: 'notes',
        placeholder: 'ملاحظات او الاستخدام',
        value: item.notes
      },
    ],
    buttons: [
      {
        text: 'إلغاء',
        handler: data => {
          console.log('Cancel clicked');
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)

        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.no==""||data.inner==""||data.outer==""||data.thickness==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.bearinginfo.update(item.$key ,{no:data.no,inner: data.inner,outer: data.outer,thickness: data.thickness,notes: data.notes}).then(
            //  if (this.platform.is('android')) {        
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    // }
         )
        }
      }
    ]
  });
  prompt.present();
}

removeBearing(item){
    this.bearinginfo.remove(item.$key).then(
            this.notifications.push({
            text: item.no,action:"حذف",class:"بلي"
          })
          );;
}
}
