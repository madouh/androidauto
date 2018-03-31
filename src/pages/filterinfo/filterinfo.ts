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
  selector: 'page-filterinfo',
  templateUrl: 'filterinfo.html',
})
export class FilterinfoPage {
  term:string
  filterinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
   filters=[]
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.filterinfo = this.afoDatabase.list('/filterinfo'); 
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

  //       this.filters =  [
  //   { no:'428' , inner:23.5 ,outer:65,usage:"جاز",notes:"" },
  //   { no:'208' , inner:17.5 ,outer:57,usage:"جاز",notes:"دبابة + npr" },
  //   { no:'302' , inner:18.5 ,outer:58,usage:"زيت",notes:"ديهاتسو" },
  //   { no:'430 = 830' , inner:14.5 ,outer:63,usage:"جاز",notes:"اسكانيا" },
  //   { no:'409' , inner:23 ,outer:87,usage:"زيت",notes:"مازدا 3500" },
  //   { no:'158' , inner:17.5 ,outer:60,usage:"جاز",notes:"تويوتا 90" },
  //   { no:'115' , inner:22.5 ,outer:71,usage:"زيت",notes:" تويوتا 5L" },
  //   { no:'518' , inner:36 ,outer:95,usage:"زيت",notes:"" },
  //   { no:'406' , inner:23.5 ,outer:65,usage:"",notes: ""},
  //   { no:'707' , inner:18.5 ,outer:58,usage:"جاز",notes:"ديهاتسو" },
  //   { no:'زيت لانسر' , inner:18.5 ,outer:61,usage:"زيت",notes:"لانسر" },
  //   { no:'561' , inner:17.5 ,outer:65,usage:"زيت",notes:"لادا" },
  //   { no:'512' , inner:18 ,outer:80,usage:"زيت",notes:"دبابة + كانتر" },
  //   { no:'ديماكس 2014' , inner:24.5 ,outer:69,usage:"زيت",notes:"ديماكس" },
  //   { no:'734' , inner:18 ,outer:58,usage:"جاز",notes:"مازدا = 319" },
  //   { no:'319' , inner:18 ,outer:58,usage:"جاز",notes:"كانتر = 734" },
  //   { no:'931' , inner:17.5 ,outer:58,usage:"زيت",notes:"ديماكس" },
  //   { no:'102' , inner:17.5 ,outer:58,usage:"زيت",notes:"تويوتا بنزين" },
  //   { no:'207' , inner:17.5 ,outer:58,usage:"زيت",notes:"=931" },
  //   { no:'503' , inner:18.5 ,outer:87,usage:"زيت",notes:"لاف + كانتر حديث" },
  //   { no:'101' , inner:17.5 ,outer:62,usage:"زيت",notes:"تويوتا 2L + 3L" },
  //   { no:'304=X18' , inner:18.5 ,outer:56,usage:"زيت",notes:"هيونداي" },
  //   { no:'108' , inner:17.5 ,outer:58,usage:"زيت",notes:"سويفت" },
  //   { no:'زيت دايو' , inner:17 ,outer:65,usage:"زيت",notes:"دايو" },
  //   { no:'111' , inner:17.5 ,outer:65,usage:"زيت",notes:"تويوتا ؟؟" },
  //   { no:'234' , inner:17.5 ,outer:65,usage:"جاز",notes:"نيسان" },
  //   { no:'جاز فضي' , inner:17.5 ,outer:58,usage:"جاز",notes:"جامبو = 208" },
  //   { no:'زيت بخاخة' , inner:17.5 ,outer:65,usage:"زيت",notes:"تويوتا 2005" }
  // ]
  // .subscribe(snapshots=>{
  //       snapshots.forEach(snapshot => {
  //         // this.removeProduct(snapshot)
  //         this.filterinfo.push({name:snapshot.name,info:snapshot.info})
  //       }); 
  //     })
  // this.filters.forEach(e=>{
  //     this.filterinfo.push({
  //           no:e.no,inner:e.inner,outer:e.outer,usage:e.usage,notes:e.notes
  //         })  
  // })
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Page');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }
   
  addFilterInfo(){
     if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات  فلتر',
    message: "أدخل مقاس قلاوظ الفلتر واﻷستك والاستعمال زيت ام جاز",
    inputs: [
      {
        name: 'no',
        placeholder: 'رقم الفلتر او اسمه'
      },{
        name: 'inner',
        placeholder: ' مقاس القلاوظ '
      },
    {
        name: 'outer',
        placeholder: 'مقاس الاستك'
      },
    {
        name: 'usage',
        placeholder: 'الاستخدام'
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
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)

        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.no==""||data.inner==""||data.outer==""||data.usage==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات ضروريا  !',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.filterinfo.push({
            no:data.no,inner:data.inner,outer:data.outer,usage:data.usage,notes:data.notes
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
          this.removeFilter(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateFilterInfo(item);
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
updateFilterInfo(item){
   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'تعديل بيانات فلتر',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'no',
        placeholder: 'رقم الفلتر',
        value: item.no
      },{
        name: 'inner',
        placeholder: 'قلاوظ الفلتر',
        value: item.inner
      },
      {
        name: 'outer',
        placeholder: 'مقاس الاستك',
        value: item.outer
      },
   
    {
        name: 'usage',
        placeholder: 'زيت ام جاز',
        value: item.usage
      },
     {
        name: 'notes',
        placeholder: 'ملاحظات  ',
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
           if(data.no==""||data.inner==""||data.outer==""||data.usage==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات ضروريا  !',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.filterinfo.update(item.$key ,{no:data.no,inner:data.inner,outer: data.outer,usage: data.usage,notes: data.notes}).then(
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

removeFilter(item){
    this.filterinfo.remove(item.$key).then(
            this.notifications.push({
            text: item.no,action:"حذف",class:"فلتر"
          })
          );;
}
}
