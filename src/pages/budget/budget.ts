import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from '../../pages/home/home';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-budget',
  templateUrl: 'budget.html',
})
export class BudgetPage {
 
  term:string
  budgetCount;
  budget: FirebaseListObservable<any>;

  constructor(public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.budget = af.list('/budget');  
//     this.budget.$ref.on("value", function(snapshot) {     
//   console.log("There are "+snapshot.numChildren()+" messages");
// })
// this.budgetCount=this.budget
// console.log(this.budgetCount)
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
     var itemDate: String = new Date().toLocaleDateString();
    var itemTime: String = new Date().toLocaleTimeString();
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
          console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
        if( data.mony==""|| data.details==""){
            console.log(data);
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.budget.push({
          mony:data.mony, details:data.details,itemDate:itemDate,itemTime:itemTime
          });
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
              subTitle: 'لا يمكن ان يكون اسم الصنف أو العدد خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.budget.update(item.$key ,{mony: data.mony,details: data.details});
        }
      }
    ]
  });
  prompt.present();
}

removeProduct(id){
  console.log(id)
  this.budget.remove(id);
}

}
