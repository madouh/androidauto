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
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {
   term:string
  admins: AfoListObservable<any[]>;
  editor:string;
   notifications:  AfoListObservable<any[]>;
  message;
  number;
  myContacts=[];
  providerContacts:  AfoListObservable<any[]>;;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private contacts: Contacts,private callNumber: CallNumber,private sms: SMS,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,public actionSheetCtrl:ActionSheetController, private afAuth:AngularFireAuth,public alertCtrl:AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {

    this.providerContacts = this.afoDatabase.list('/contacts', {
      query: {
        
      }
    });
    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
            // this.notifications = this.afoDatabase.list('/notifications');

      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })

  //     this.contacts.find(['displayName'], {filter: "", multiple: true})
  //   .then(data => {
  //     this.myContacts = data
  //   });

  //     console.log(this.myContacts);

   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();

        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
   }

 gotoHome(){
  this.navCtrl.push(HomePage)
}

 addProviderContact(){
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات مورد',
    message: "أدخل الاسم و بيانات المورد",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم المورد'
      },
    {
        name: 'number',
        placeholder: 'هاتف المورد'
      },
    {
        name: 'notes',
        placeholder: 'ملاحظات '
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
          if(data.name==""||data.number==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون الاسم أو الهاتف خاليا!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.providerContacts.push({
            name: data.name,number:data.number,deposite:0,notes:data.notes
          });
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
          this.removeProviderContact(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateProviderContact(item);
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
updateProviderContact(item){
  let prompt = this.alertCtrl.create({
    title: 'تعديل بيانات مورد ',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم المورد',
        value: item.name
      },
   
    {
        name: 'number',
        placeholder: 'رقم الهاتف',
        value: item.number
      },
   
    {
        name: 'notes',
        placeholder: 'ملاحظات',
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
            if(data.name==""||data.number==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون الاسم أو الهاتف خاليا!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.providerContacts.update(item.$key ,{name: data.name,number: data.number,notes: data.notes})
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

removeProviderContact(item){
    this.providerContacts.remove(item.$key)
}
}

