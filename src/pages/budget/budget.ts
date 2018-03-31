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
  selector: 'page-budget',
  templateUrl: 'budget.html',
})
export class BudgetPage {
 
  term:string
  budgetCount;
  budget:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  sum:number=0;
  sumValue = 0;
  notifications:  AfoListObservable<any[]>;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.budget = this.afoDatabase.list('/budget');  
    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
      
    }); 
     this.notifications = this.afoDatabase.list('/notifications');

    this.budget.subscribe(data => {
  data.forEach(item => {
    // sum here
    // calculateSum(item.mony);
  });
    })
// calculateSum(value) {
//   this.sum = this.sum + parseInt(value);
// }

      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
 if (this.platform.is('android')) {        
        this.screenOrientation.unlock();

        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
  }
     
  ionViewDidLoad() {
    console.log('ionViewDidLoad BearingPage');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }

showAlert() {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
    });
    alert.present();
  }
   

  addBudgetItem(){
     var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
 
  let prompt = this.alertCtrl.create({
    title: 'إدخال بند ميزانية',
    message: "أدخل اسم الصنف و العدد الموجود منه",
    inputs: [
      
    {
        name: 'mony',
        placeholder: ' المبلغ'
      },
    {
        name: 'details',
        placeholder: 'تفاصيل '
      },
      
    ],
    buttons: [
      {
        text: 'ألغاء',
        handler: data => {
        }
      },
      {
        text: 'حفظ',
        handler: data => {
        if( data.mony==""|| data.details==""){
            console.log(data);
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان البيان  أو المبلغ خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.budget.push({
          mony:data.mony, details:data.details,itemDate:orderDate,itemTime:orderTime
        }).then(
            this.notifications.push({
            text: data.mony,number:data.details,action:"اضافة",class:"ميزانية",orderDate:orderDate,orderTime:orderTime
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
    title: 'تعديل بند ميزانية ',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
     
    {
        name: 'mony',
        placeholder: 'المبلغ',
        value: item.mony
      },
   
    {
        name: 'details',
        placeholder: 'تفاصيل',
        value: item.details
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
           if(data.mony==""|| data.details==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان البيان  أو المبلغ خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.budget.update(item.$key ,{mony: data.mony,details: data.details}).then(
            this.notifications.push({
            text: data.name,number:data.number,action:"تعديل",class:"ميزانية",orderDate:orderDate,orderTime:orderTime
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
    this.budget.remove(item.$key).then(
            this.notifications.push({
            text: item.details,number:item.mony,action:"حذف",class:"ميزانية",orderDate:orderDate,orderTime:orderTime
          })
          );
}

}
