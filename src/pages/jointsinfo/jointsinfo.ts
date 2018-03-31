import { ScreenOrientation } from '@ionic-native/screen-orientation';
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
import { JointdetailsPage } from '../../pages/jointdetails/jointdetails';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-jointsinfo',
  templateUrl: 'jointsinfo.html',
})
export class JointsinfoPage {
  term:string
  jointinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
   joints=[]
   selectedItem;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.jointinfo = this.afoDatabase.list('/jointinfo'); 
    this.notifications = this.afoDatabase.list('/notifications');
  
    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 

    if (this.platform.is('android')) {        
               
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
      }
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
  //  this.joints=[{ no:'13' , kostoban: 26,length:68,style:"خارجي" },
  //   { no:'6' , kostoban: 28,length:82,style:"خارجي" },
  //   { no:'12' , kostoban: 26,length:80,style:"خارجي" },
  //   { no:'11' , kostoban: 20,length:57,style:"داخلي" },
  //   { no:'27' , kostoban: 25,length:66,style:"خارجي" },
  //   { no:'52' , kostoban: 29,length:80,style:"خارجي" },
  //   { no:'17' , kostoban: 29,length:80,style:"خارجي" },
  //   { no:'46' , kostoban: 27,length:75,style:"خارجي" },
  //   { no:'1000' , kostoban: 27,length:82,style:"داخلي" },
  //   { no:'500' , kostoban: 24,length:42,style:"داخلي" },
  //   { no:'120' , kostoban: 32,length:94,style:"خارجي" },
  //   { no:'66' , kostoban: 33,length:94,style:"داخلي" },
  //   { no:'62' , kostoban: 35,length:105,style:"داخلي" },
  //   { no:'73' , kostoban: 33,length:104,style:"داخلي" },
  //   { no:'87' , kostoban: 28,length:81,style:"داخلي" },
  //   { no:'10' , kostoban: 22,length:58,style:"خارجي" }]
// .subscribe(snapshots=>{
      //   snapshots.forEach(snapshot => {
      //     this.removeProduct(snapshot)
          // this.informations.push({name:snapshot.name,info:snapshot.info})
      //   }); 
      // })
  // this.joints.forEach(e=>{
  //     this.jointinfo.push({
  //           no:e.no,kostoban:e.kostoban,length:e.length,style:e.style
  //         })  
  // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BearingPage');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }
   
  addJointInfo(){
    if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات  صليبة',
    message: "أدخل بيانات الصليبة ",
    inputs: [
      {
        name: 'no',
        placeholder: 'رقم الصليبة'
      },
    {
        name: 'kostoban',
        placeholder: 'مقاس الكوستبان'
      },
    {
        name: 'length',
        placeholder: 'طول الصليبة'
      },
    {
        name: 'style',
        placeholder: 'خارجي أم داخلي'
      },
      {
        name: 'notes',
        placeholder: 'ملاحظات أو الاستخدام'
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
           if(data.no==""||data.kostoban==""||data.length==""||data.style==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: '  قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.jointinfo.push({
            no:data.no,kostoban:data.kostoban,length:data.length,style:data.style,notes:data.notes
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
          this.removeJoint(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateJointInfo(item);
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
updateJointInfo(item){
   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'تعديل بيانات  صليبة ',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'no',
        placeholder: 'مقاس الاويل سيل ',
        value: item.no
      },
      {
        name: 'kostoban',
        placeholder: 'مقاس الكوستبان',
        value: item.kostoban
      },
   
    {
        name: 'length',
        placeholder: 'طول الصليبة',
        value: item.length
      },
    {
        name: 'style',
        placeholder: 'مكان التيلة داخلي أم خارجي',
        value: item.style
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
           if(data.no==""||data.kostoban==""||data.length==""||data.style==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.jointinfo.update(item.$key ,{no:data.no,kostoban: data.kostoban,length: data.length,style: data.style,notes: data.notes}).then(
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

showDetails($event, joint){
   // That's right, we're pushing to ourselves!
    this.navCtrl.push(JointdetailsPage, {
      item: joint
    });
}

removeJoint(item){
    this.jointinfo.remove(item.$key).then(
            this.notifications.push({
            text: item.no,action:"حذف",class:"صلايب "
          })
          );;
}
}
