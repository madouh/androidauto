import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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
  selector: 'page-agel',
  templateUrl: 'agel.html',
})
export class AgelPage {
  term:string
  agels:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  orderDate: String = new Date().toLocaleDateString();
  orderTime: String = new Date().toLocaleTimeString();
  selectedItem: any;
  orders:  AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;

  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public actionSheetCtrl: ActionSheetController,public alertCtrl:AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    this.agels = this.afoDatabase.list('/agels');
    this.selectedItem = navParams.get('item');
   this.orders = this.afoDatabase.list('/orders'); 
    this.admins =this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
         this.notifications = this.afoDatabase.list('/notifications');

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
  addAgelOperation(){
     
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
        placeholder: 'العدد '
      },
      {
        name: 'price',
        placeholder: 'الثمن '
      },
      {
        name: 'buyer',
        placeholder: 'لحساب'
      },{
        name: 'remainder',
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
          if(data.name==""|| data.number==""||data.price==""|| data.remainder==""||data.buyer==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اي حقل خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.agels.push({
            name: data.name,number:data.number,price:data.price,remainder:data.remainder,buyer:data.buyer,orderDate:this.orderDate,orderTime:this.orderTime
          });
        }
      }
    ]
  });

  prompt.present();
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgelPage');
  }

addItemToOrders(event, item) {
  var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
  
    let alert = this.alertCtrl.create();
    alert.setTitle('إضافة للنواقص');

    alert.addInput({
      type: 'radio',
      label: 'كهرباء',
      id:"addToOrdersAlert",
      value: 'electric',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'ملاكي',
      id:"addToOrdersAlert",
      value: 'mallaky',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'بلي و أويل سيل',
      id:"addToOrdersAlert",
      value: 'bearing',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'غير ذلك',
      id:"addToOrdersAlert",
      value: 'others',
      checked: false
    });

    alert.addButton('إلغاء');
    alert.addButton({
      text: 'موافق',
      handler: data => {
        console.log(data);

         if(data==undefined){
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'يجب ان تختار فئة الصنف أولاً!',
              buttons: ['موافق']
            });
    erralert.present();
                return
           }
        this.orders.push({
            name: item.name,number:item.number,class:data,orderDate:this.orderDate,orderTime:this.orderTime
          }).then(
            this.notifications.push({
            text: data.buyer,number:data.price,action:"اضافة",class:"آجل",orderDate:orderDate,orderTime:orderTime
          })
          );
      }
    });
    alert.present();
  
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(AgelPage, {
      item: item
    });
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
    title: ' تعديل عملية بيع آجل',
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
      }, {
        name: 'price',
        placeholder: 'الثمن',
        value: item.price
      }
      ,{
        name: 'buyer',
        placeholder: 'لحساب',
        value: item.buyer
      } 
      ,{
        name: 'remainder',
        placeholder: 'الباقي',
        value: item.remainder
      } ,
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
          if(data.name==""|| data.number==""||data.price==""||data.buyer==""|| data.remainder==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.agels.update(item.$key ,{name: data.name,price: data.price,numbernumber: data.number,remainder:data.remainder,buyer:data.buyer}).then(
            this.notifications.push({
            text: data.buyer,number:data.price,action:"تعديل",class:"آجل",orderDate:orderDate,orderTime:orderTime
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
    this.agels.remove(item.$key).then(
            this.notifications.push({
            text: item.buyer,number:item.price,action:"حذف",class:"آجل",orderDate:orderDate,orderTime:orderTime
          })
          );;
}


}
