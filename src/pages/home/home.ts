import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  term:string
  orders:  AfoListObservable<any[]>;
  sales:  AfoListObservable<any[]>;
  editor:string;
   orderDate: String = new Date().toLocaleDateString();
  orderTime: String = new Date().toLocaleTimeString();
  // users: Array<{name: string, uid: string}>;
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private afoDatabase:AngularFireOfflineDatabase , private afAuth:AngularFireAuth,public actionSheetCtrl:ActionSheetController,public navCtrl: NavController, public alertCtrl: AlertController,af: AngularFireDatabase) {
  // this.orders = af.list('/orders');
  // this.users = [
  //     { name: 'ممدوح', uid: "jPssY8DBXCTjlaCBvgAYVhsf7MY3" },
  //     { name: 'محمد', uid: "jPssY8DBXCTjlaCBvgAYVhsf7MY1" },
  //     { name: 'سالم', uid: "jPssY8DBXCTjlaCBvgAYVhsf7MY2" }
  //   ];
    this.orders = this.afoDatabase.list('/orders');
    this.sales = this.afoDatabase.list('/sales');

    // for(let i=0;i<=2;i++){
    //    if(this.users[i].uid==this.afAuth.auth.currentUser.uid){
    //   this.editor=this.users[i].name
    // }
    // }

   if (this.platform.is('android')) {        
        this.screenOrientation.unlock();

        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }
}

vibrate(){
    // this.vibration.vibrate(1000);
    console.log("Vibration ok")
}

gotoHome(){
  this.navCtrl.push(HomePage)
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
      label: 'بلي',
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
      label: 'سيور',
      id:"addToOrdersAlert",
      value: 'belt',
      checked: false
    });
alert.addInput({
      type: 'radio',
      label: 'سيكن',
      id:"addToOrdersAlert",
      value: 'seikien',
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
      label: 'عقل',
      id:"addToOrdersAlert",
      value: 'akl',
      checked: false
    });
alert.addInput({
      type: 'radio',
      label: 'مسامير',
      id:"addToOrdersAlert",
      value: 'mosmar',
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
    // this.navCtrl.push(AgelPage, {
    //   item: item
    // });
  }


 
  ionViewDidLoad() {
    // this.afAuth.authState.subscribe(data=>{
    //   if(data.uid){
    //     console.log(data.uid+" "+data.email)
    //     this.toast.create({
    //       message:'مرحباً بك في الطيبة لقطع غيار السيارات',
    //       duration:3000
    //     }).present();
    //   }
    //   else{
    //      this.toast.create({
    //       message:'عفواً لايمكنك الدخول ، حاولا لاحقاً',
    //       duration:3000
    //     }).present();
    //     this.navCtrl.push(LoginPage)
    //   }
      // console.log(data)})
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

removeProduct(id){
  console.log(id)
  this.orders.remove(id);
}
}