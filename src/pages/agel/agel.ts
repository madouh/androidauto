import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home'
/**
 * Generated class for the AgelPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-agel',
  templateUrl: 'agel.html',
})
export class AgelPage {
  term:string
  agels: FirebaseListObservable<any>;
  orderDate: String = new Date().toLocaleDateString();
  orderTime: String = new Date().toLocaleTimeString();
  selectedItem: any;
  orders: FirebaseListObservable<any>;

  constructor(public actionSheetCtrl: ActionSheetController,public alertCtrl:AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    this.agels = af.list('/agels');
    this.selectedItem = navParams.get('item');
    this.orders = af.list('/orders');

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
          });
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
          this.removeProduct(item.$key);
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
      }
      , {
        name: 'remainder',
        placeholder: 'الباقي',
        value: item.remainder
      }
      , {
        name: 'buyer',
        placeholder: 'لحساب',
        value: item.buyer
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
          this.agels.update(item.$key ,{name: data.name,price: data.price,number: data.number,remainder:data.remainder,buyer:data.buyer});

        }
      }
    ]
  });
  prompt.present();
}

removeProduct(id){
  console.log(id)
  this.agels.remove(id);
}


}
