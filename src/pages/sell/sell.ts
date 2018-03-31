import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home'
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-sell',
  templateUrl: 'sell.html',
})
export class SellPage {
    filterString:string;
    sales:  AfoListObservable<any[]>;
    orders:  AfoListObservable<any[]>;
    selectedItem: any;
    orderDate: String = new Date().toLocaleDateString();
    orderTime: String = new Date().toLocaleTimeString();
    admins: AfoListObservable<any[]>;
    editor:string;
    notifications:  AfoListObservable<any[]>;

  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase,private afAuth:AngularFireAuth ,public actionSheetCtrl: ActionSheetController,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,af: AngularFireDatabase) {
      this.sales = this.afoDatabase.list('/sales');
      this.orders = this.afoDatabase.list('/orders');
     this.selectedItem = navParams.get('item');

     this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
// thorya.omm.medo medoofmedo
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

  addSales(){
    
  let prompt = this.alertCtrl.create({
    cssClass: 'custom-alert',
    title: 'إدخال بند بيع',
    message: "أدخل اسم الصنف والسعر والعدد الباقي",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف'
        
      },
    {
        name: 'number',
        placeholder: 'العدد'
      },
    {
        name: 'price',
        placeholder: 'إجمالي المبلغ'
      },
    {
        name: 'remainder',
        placeholder: 'العدد الباقي'
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

           if(data.name==""|| data.number==""||data.price==""||data.remainder==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون أي حقل خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }

          this.sales.push({
            name: data.name,number:data.number,price:data.price,remainder:data.remainder,orderDate:this.orderDate,orderTime:this.orderTime
          });
        }
      }
    ]
  });
  

  prompt.present();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SellPage');
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
      label: 'فيات',
      id:"addToOrdersAlert",
      value: 'fait',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'كماليات',
      id:"addToOrdersAlert",
      value: 'acessoir',
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
      label: 'ياباني',
      id:"addToOrdersAlert",
      value: 'japan',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'سيكن',
      id:"addToOrdersAlert",
      value: 'seikien',
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
            text: data.name,number:data.number,action:"اضافة",class:"مبيعات",orderDate:orderDate,orderTime:orderTime
          })
          );
      }
    });
    alert.present();
  
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(SellPage, {
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
    title: 'تعديل عملية بيع',
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
          if(data.name==""|| data.number==""||data.price==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد أو السعر خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.sales.update(item.$key ,{name: data.name,price: data.price,number: data.number}).then(
            this.notifications.push({
            text: data.name,number:data.number,action:"تعديل",class:"مبيعات",orderDate:orderDate,orderTime:orderTime
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
    this.sales.remove(item.$key).then(
            this.notifications.push({
            text: item.name,number:item.number,action:"حذف",class:"مبيعات",orderDate:orderDate,orderTime:orderTime
          })
          );
}


}
