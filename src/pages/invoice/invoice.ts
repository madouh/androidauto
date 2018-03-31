import { Component } from '@angular/core';
import { AlertController,ActionSheetController, NavController,NavParams} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage} from '../home/home';
import  firebase from 'firebase';
import { IonicPage} from 'ionic-angular';
import { AfoListObservable,
  AfoObjectObservable,
  AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  term:string
  paid=0;
  lastdept=0;
  jointinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
  displayName; 
    provider=""; 
  invoices: FirebaseListObservable<any[]>;
  invoicesTable:FirebaseListObservable<any[]>;
  invoicesTableForOneProvider: AfoListObservable<any[]>;
  providers: FirebaseListObservable<any[]>;
  invoice: FirebaseListObservable<any[]>;
  depositeline:  AfoListObservable<any[]>;
  invoiceKey="";
  theSumOfInvoice=0
  invoicedate = new Date();
  lastdeptcalculated:boolean=false;
  deposite=0;
    constructor(public platform: Platform,private screenOrientation: ScreenOrientation,
    private localNotifications: LocalNotifications,
    private afoDatabase:AngularFireOfflineDatabase ,
    public alertCtrl: AlertController,
    af: AngularFireDatabase,
     public navParams: NavParams,
      public navCtrl: NavController,
       afDB: AngularFireDatabase,
        public actionSheetCtrl: ActionSheetController,
    private afAuth: AngularFireAuth) {
    this.invoicesTable = afDB.list('/invoicesTable');
    this.invoices = afDB.list('/invoices');
    this.providers = afDB.list('/contacts');
 
//-- Delete any invoices has no provider 
//-- which was created before adding any invoices items
    this.invoicesTable.forEach(snapshot=>{
     // console.log(snapshot)
      snapshot.forEach(e=>{
       // console.log(e.provider)
      if(e.provider==""){
           this.invoicesTable.remove(e.$key)
      }
      })
      // }
        })
     afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;      
    });
    this.admins = this.afoDatabase.list('/admins', {
      query: {
        orderByChild: 'uid',
        equalTo: this.afAuth.auth.currentUser.uid 
      }
    }); 
      // this.admins.forEach(e=>{
      //   this.editor=e[0].name
      // })
       if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
      }

   var c = this;
setInterval(function(){
  if((c.lastdept==0) && !(c.provider =="") && !c.lastdeptcalculated){
       c.invoicesTableForOneProvider=c.afoDatabase.list("/invoicesTable",{
      query: {
         orderByChild: 'provider',
        equalTo: c.provider
      }
    })
    c.calculateLastDept()
    c.lastdeptcalculated=true
    c.depositeline=c.afoDatabase.list("/contacts",{
      query: {
         orderByChild: 'name',
        equalTo: c.provider
      }
    })
    c.depositeline.forEach(element=>{
      element.forEach(e=>{
        c.deposite=parseFloat(e.deposite);
        console.log(e);
      })
    })
  }
}, 1000);
   

   

  this.NewInvoice()

  this.invoice = afDB.list('/invoices', {
      query: {
         orderByChild: 'invoiceKey',
        equalTo: this.invoiceKey
      }
    }); 

    this.invoice.subscribe(data => {
      this.theSumOfInvoice=0.0;
  data.forEach(item => {
    //console.log(item)
  this.theSumOfInvoice = this.theSumOfInvoice + item.num*item.price;
  });
    this.invoicesTable.update(this.invoiceKey ,{provider:this.provider,sum:this.theSumOfInvoice,paid:this.paid,invoicedate:this.invoicedate });//.toLocaleDateString()

});
  }

calculateLastDept(){
  var dept=0
 if(this.lastdeptcalculated){
   return
 }
  // console.log("Hello")
 this.invoicesTableForOneProvider.forEach(data => {
  //  console.log(data);
  //  console.log("Hello2")
  dept=0.0;
  data.forEach(item => {
    // console.log("Hello3")
    // console.log(item.$key +" "+ this.invoiceKey)
    if(!(item.$key==this.invoiceKey)){
  dept = dept + (item.sum-item.paid);
  // console.log(this.lastdept)
   }
        });
  this.lastdept=dept
});  
}

addPaid(){
  // if(!(this.provider==null)){ 
  this.invoicesTable.update(this.invoiceKey ,{provider:this.provider,sum:this.theSumOfInvoice,paid:this.paid,invoicedate:this.invoicedate})
// }
}

  NewInvoice(){
  this.invoiceKey=this.invoicesTable.push({provider:this.provider,sum:0,paid:0,invoicedate:this.invoicedate }).key;
  }

  AddItemToInvoice(){
    this.addPaid();
    if(!this.invoiceKey){
       this.NewInvoice()
    }
   var invoiceDate= new Date();
  //  console.log(this.invoicedate);
   if(this.invoicedate==undefined){
    this.invoicedate=invoiceDate
   }
   // console.log(this.invoicedate);
    let prompt = this.alertCtrl.create({
    title: 'إدخال بيان  صنف',
    message: "أدخل بيانات التالية ",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف'
      },
    {
        name: 'num',
        placeholder: 'العدد'
      },
    {
        name: 'price',
        placeholder: 'السعر'
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
          if(this.provider==""||this.invoicedate==null){
            let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: '   اسم المورد أو التاريخ لا يمكن أن يكون خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
          }
           if(data.name==""||data.price==""||data.num==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: '  قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
           var mykey=this.invoiceKey;
          this.invoices.push({
            invoiceKey:this.invoiceKey,name:data.name,price:data.price,num:data.num,provider:this.provider,invoicedate:this.invoicedate
          })
        }
      }
    ]
  });

  prompt.present();
  }

  setDate($event){

    this.invoicedate= $event
  }

gotoHome(){
    this.navCtrl.push(HomePage)
  } 

 showOptions(item) {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'ماذا تريد أن تفعل؟',
    buttons: [
      {
        text: 'حذف',
        role: 'destructive',
        handler: () => {
          this.removeInvoiceItem(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateInvoiceItem(item);
        }
      },{
        text: 'إلغاء',
        role: 'cancel',
        handler: () => {
         // console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
}
/*https://developers.facebook.com/apps/779469925512432/fb-login/settings/*/
updateInvoiceItem(item){
  let prompt = this.alertCtrl.create({
    title: 'تعديل بند فاتورة ',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'name',
        placeholder: 'اسم الصنف',
        value: item.name
      },
      {
        name: 'num',
        placeholder: 'العدد',
        value: item.num
      },
   
    {
        name: 'price',
        placeholder: 'السعر',
        value: item.price
      },
     
    ],
    buttons: [
      {
        text: 'إلغاء',
        handler: data => {
        //  console.log('Cancel clicked');
        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.name==""||data.num==""||data.price==""){
             //   console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'قد يكون احد البيانات خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.invoices.update(item.$key ,{name:data.name,num: data.num,price: data.price})
        }
      }
    ]
  });
  prompt.present();
}

removeInvoiceItem(item){
    this.invoice.remove(item.$key)
}
}