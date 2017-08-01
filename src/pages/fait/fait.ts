import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home'
import { ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the FaitPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-fait',
  templateUrl: 'fait.html',
})
export class FaitPage {
  term:string
  orders: FirebaseListObservable<any>;

  constructor(public actionSheetCtrl:ActionSheetController,public alertCtrl:AlertController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    this.orders = af.list('/orders');
  }

gotoHome(){
  this.navCtrl.push(HomePage)
}
  addFaitOrder(){
     var orderDate: String = new Date().toLocaleDateString();
    var orderTime: String = new Date().toLocaleTimeString();
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
          if(data.name==""|| data.number==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.orders.push({
            name: data.name,number:data.number,class:"fait",orderDate:orderDate,orderTime:orderTime
          });
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
           if(data.name==""|| data.number==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.orders.update(item.$key ,{name: data.name,number: data.number});
        }
      }
    ]
  });
  prompt.present();
}

removeProduct(id){
  console.log(id)
  this.orders.remove(id);
}
}
