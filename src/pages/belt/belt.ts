import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import {GotoPage} from '../../app/services/somefunctions'

@Component({
  selector: 'page-belt',
  templateUrl: 'belt.html',
})
export class BeltPage {

 term:string
  orders: FirebaseListObservable<any>;

  constructor(public alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController,af: AngularFireDatabase, public navParams: NavParams) {
    this.orders = af.list('/orders');    
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
   
  addAcessoirOrder(){
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
            name: data.name,number:data.number,class:"belt",orderDate:orderDate,orderTime:orderTime
          });
        }
      }
    ]
  });

  prompt.present();
}

ionViewDidLoad() {
    console.log('ionViewDidLoad AcessoirPage');
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
