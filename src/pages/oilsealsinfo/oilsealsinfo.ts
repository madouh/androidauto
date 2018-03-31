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
  selector: 'page-oilsealsinfo',
  templateUrl: 'oilsealsinfo.html',
})
export class OilsealsinfoPage {

  term:string
  oilsealinfo:  AfoListObservable<any[]>;
  admins: AfoListObservable<any[]>;
  editor:string;
  notifications:  AfoListObservable<any[]>;
   oilseals=[]
  constructor(public platform: Platform,private screenOrientation: ScreenOrientation,private localNotifications: LocalNotifications,private afoDatabase:AngularFireOfflineDatabase ,private afAuth:AngularFireAuth,public alertCtrl: AlertController,af: AngularFireDatabase,public actionSheetCtrl: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.oilsealinfo = this.afoDatabase.list('/oilsealinfo'); 
    this.notifications = this.afoDatabase.list('/notifications');

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
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    }

  //   this.oilseals =  [
  //   { no:'25×37×7' , inner: 25,outer:37,thickness:7 },
  //   { no:'16×32×7' , inner: 16,outer:32,thickness:7 },
  //   { no:'20×34×7' , inner: 20,outer:34,thickness:7 },
  //   { no:'15×32×7' , inner: 15,outer:32,thickness:7 },
  //   { no:'18×32×7' , inner: 18,outer:32,thickness:7 },
  //   { no:'19×32×7' , inner: 19,outer:32,thickness:7 },
  //   { no:'16×30×7' , inner: 16,outer:30,thickness:7 },
  //   { no:'15×34×7' , inner: 15,outer:34,thickness:7 },
  //   { no:'22×35×7' , inner: 22,outer:35,thickness:7 },
  //   { no:'10×24×7' , inner: 10,outer:24,thickness:7 },
  //   { no:'20×32×7' , inner: 20,outer:32,thickness:7 },
  //   { no:'17×37×6/7.5' , inner: 17,outer:37,thickness:6 },
  //   { no:'14.5×32×7.5/8' , inner: 14.5,outer:32,thickness:7.5 },
  //   { no:'20×35×7' , inner: 20,outer:35,thickness:7 },
  //   { no:'22×36×7' , inner: 22,outer:36,thickness:7 },
  //   { no:'17×35×7' , inner: 17,outer:35,thickness:7 },
  //   { no:'12×22×7' , inner: 12,outer:22,thickness:7 },
  //   { no:'17×30×7' , inner: 17,outer:30,thickness:7 },
  //   { no:'22×38×7' , inner: 22,outer:38,thickness:7 },
  //   { no:'20×38×7' , inner: 20,outer:38,thickness:7 },
  //   { no:'20×36×7' , inner: 20,outer:36,thickness:7 },
  //   { no:'15×35×7' , inner: 15,outer:35,thickness:7 },
  //   { no:'12×24×7' , inner: 12,outer:24,thickness:7 },
  //   { no:'20×33.5×/' , inner: 20,outer:33.5,thickness:7 },
  //   { no:'14×25×7' , inner: 14,outer:25,thickness:7 },
  //   { no:'12×25×7' , inner: 12,outer:25,thickness:7 },
  //   { no:'14×28×7' , inner: 14,outer:28,thickness:7 },

  //   { no:'20×40×10' , inner: 20,outer:40,thickness:10 },
  //   { no:'30×42×8' , inner: 30,outer:42,thickness:8 },
  //   { no:'30×47×10' , inner: 30,outer:47,thickness:10 },
  //   { no:'30×44×7' , inner: 30,outer:44,thickness:7 },
  //   { no:'28×40×8' , inner: 28,outer:40,thickness:8 },
  //   { no:'30×46×8' , inner: 30,outer:46,thickness:8 },
  //   { no:'30×48×8' , inner: 30,outer:48,thickness:8 },
  //   { no:'20×47×9.5' , inner: 20,outer:47,thickness:9.5 },
  //   { no:'20×47×8' , inner: 20,outer:47,thickness:8 },
  //   { no:'28×45×8' , inner: 28,outer:45,thickness:8 },
  //   { no:'25×41.1×8' , inner: 25,outer:41.1,thickness:8 },
  //   { no:'25×45×7' , inner: 25,outer:45,thickness:7 },
  //   { no:'25×45×10' , inner: 25,outer:45,thickness:10 },
  //   { no:'28×48×10' , inner: 28,outer:48,thickness:10 },
  //   { no:'32×44×10' , inner: 32,outer:44,thickness:10 },
  //   { no:'35×45×7' , inner: 35,outer:45,thickness:7 },
  //   { no:'32×45×7' , inner: 32,outer:45,thickness:7 },
  //   { no:'35×48×7' , inner: 35,outer:48,thickness:7 },
  //   { no:'32×47×8' , inner: 32,outer:47,thickness:8 },
  //   { no:'25×43×8' , inner: 25,outer:43,thickness:8 },
  //   { no:'30×45×8' , inner: 30,outer:45,thickness:8 },
  //   { no:'30×45×8' , inner: 30,outer:45,thickness:8 },
  //   { no:'32×46×8' , inner: 32,outer:46,thickness:8 },
  //   { no:'34×48×8' , inner: 34,outer:48,thickness:8 },
  //   { no:'35×46×8' , inner: 35,outer:46,thickness:8 },
  //   { no:'25×42×7' , inner: 25,outer:42,thickness:7 },
  //   { no:'27×42×7' , inner: 27,outer:42,thickness:7 },
  //   { no:'20×42×7' , inner: 20,outer:42,thickness:7 },
  //   { no:'35×47×8' , inner: 35,outer:47,thickness:8 },
  //   { no:'36×46×9' , inner: 36,outer:46,thickness:9 },
  //   { no:'30×46×10' , inner: 25,outer:40,thickness:7 },
  //   { no:'27×48×8' , inner: 27,outer:48,thickness:8 },
  //   { no:'32×48×8' , inner: 32,outer:48,thickness:8 },
  //   { no:'25×47×7' , inner: 25,outer:47,thickness:7 },
  //   { no:'20×45×10' , inner: 20,outer:45,thickness:10 },
  //   { no:'20×45×7' , inner: 20,outer:45,thickness:7 },
  //   { no:'25×40×7' , inner: 25,outer:40,thickness:7 },

  //   { no:'30×55×10' , inner: 30,outer:55,thickness:10 },
  //   { no:'42×56×7' , inner: 42,outer:56,thickness:7 },
  //   { no:'40×55×9' , inner: 40,outer:55,thickness:9 },
  //   { no:'40×55×8' , inner: 40,outer:55,thickness:8 },
  //   { no:'25×52×7' , inner: 25,outer:52,thickness:7 },
  //   { no:'38×50×7' , inner: 38,outer:50,thickness:7 },
  //   { no:'38×50×8' , inner: 38,outer:50,thickness:8 },
  //   { no:'45×58×9' , inner: 45,outer:58,thickness:9 },
  //   { no:'35×50×8' , inner: 35,outer:50,thickness:8 },
  //   { no:'35×50×10' , inner: 35,outer:50,thickness:10 },
  //   { no:'30×52×10' , inner: 30,outer:52,thickness:10 },
  //   { no:'32×52×10' , inner: 32,outer:52,thickness:10 },
  //   { no:'35×52×10' , inner: 35,outer:52,thickness:10 },
  //   { no:'35×52×8' , inner: 35,outer:52,thickness:8 },
  //   { no:'40×57×10' , inner: 40,outer:57,thickness:10 },
  //   { no:'38×54×10' , inner: 38,outer:54,thickness:10 },
  //   { no:'32×50×7' , inner: 32,outer:50,thickness:7 },
  //   { no:'20×52×10' , inner: 20,outer:52,thickness:10 },
  //   { no:'42×55×9' , inner: 42,outer:55,thickness:9 },
  //   { no:'32×56×11' , inner: 32,outer:56,thickness:11 },
  //   { no:'28×52×10' , inner: 28,outer:52,thickness:10 },
  //   { no:'32×55×8' , inner: 32,outer:55,thickness:8 },
  //   { no:'32×55×10' , inner: 32,outer:55,thickness:10 },
  //   { no:'40×58×10' , inner: 40,outer:58,thickness:10 },
  //   { no:'35×54×10' , inner: 35,outer:54,thickness:10 },
  //   { no:'29×55×10' , inner: 29,outer:55,thickness:10 },
  //   { no:'38×55×10' , inner: 38,outer:55,thickness:10 },
  //   { no:'30×50×10' , inner: 30,outer:50,thickness:10},
  //   { no:'35×55×10' , inner: 35,outer:55,thickness:10},
  //   { no:'35×55×11' , inner: 35,outer:55,thickness:11},
  //   { no:'40×56×7' , inner: 40,outer:56,thickness:7 },
  //   { no:'40×54×7' , inner: 40,outer:54,thickness:7 },
  //   { no:'28×50×10' , inner: 28,outer:50,thickness:10 },
  //   { no:'40×54×8' , inner: 40,outer:54,thickness:8},
  //   { no:'35×56×10' , inner: 35,outer:56,thickness:10 },
  //   { no:'38.5×50.8×7.95' , inner: 38.5,outer:50.8,thickness:8 },
  //   { no:'34×50×7' , inner: 34,outer:50,thickness:7 },
  //   { no:'28×55×10' , inner: 28,outer:55,thickness:10 },
  //   { no:'38×56×10/13' , inner: 38,outer:56,thickness:10 },

  //   { no:'39×60×10' , inner: 39,outer:60,thickness:10 },
  //   { no:'35×62×10' , inner: 35,outer:62,thickness:10 },
  //   { no:'32×62×10' , inner: 32,outer:62,thickness:10 },
  //   { no:'45×68×10' , inner: 45,outer:68,thickness:10},
  //   { no:'45×68×12' , inner: 45,outer:68,thickness:12},
  //   { no:'48×65×10' , inner: 48,outer:65,thickness:10},
  //   { no:'48×65×9' , inner: 48,outer:65,thickness:9 },
  //   { no:'48×62×8' , inner: 48,outer:62,thickness:8 },
  //   { no:'48×62×10' , inner: 48,outer:62,thickness:10 },
  //   { no:'48×62×9' , inner: 48,outer:62,thickness:9},
  //   { no:'28×60×10' , inner: 28,outer:60,thickness:10 },
  //   { no:'38×60×10' , inner: 38,outer:60,thickness:10},
  //   { no:'45×60×10' , inner: 45,outer:60,thickness:10},
  //   { no:'50×68×9' , inner: 50,outer:68,thickness:9},
  //   { no:'40×66×10' , inner: 40,outer:66,thickness:10 },
  //   { no:'52×66×7.5/12' , inner: 52,outer:66,thickness:7.5 },
  //   { no:'38×65×10' , inner: 38,outer:65,thickness:10 },
  //   { no:'52×65×9' , inner: 52,outer:65,thickness:9},
  //   { no:'40×60×10' , inner: 40,outer:60,thickness:10 },
  //   { no:'30×60×10' , inner: 30,outer:60,thickness:10},
  //   { no:'40×68×10' , inner: 40,outer:68,thickness:10},
  //   { no:'52×68×10' , inner: 52,outer:68,thickness:10},
  //   { no:'38×62×7' , inner: 38,outer:62,thickness:7},
  //   { no:'38×62×10' , inner: 38,outer:62,thickness:10 },
  //   { no:'45×65×10' , inner: 45,outer:65,thickness:10},
  //   { no:'45×65×5' , inner: 45,outer:65,thickness:5},
  //   { no:'38×68×10' , inner: 38,outer:68,thickness:10 },
  //   { no:'35×65×10' , inner: 35,outer:65,thickness:10},
  //   { no:'30×62×10' , inner: 30,outer:62,thickness:10 },
  //   { no:'54×65×10' , inner: 54,outer:65,thickness:10},
  //   { no:'45×62×10' , inner: 45,outer:60,thickness:10},
  //   { no:'50×67×9' , inner: 50,outer:67,thickness:9},
  //   { no:'42×60×9' , inner: 42,outer:60,thickness:9 },
  //   { no:'42×60×7' , inner: 42,outer:60,thickness:7 },
  //   { no:'42×60×10' , inner: 42,outer:60,thickness:10 },
  //   { no:'40×65×10' , inner: 40,outer:65,thickness:10},
  //   { no:'45×67×7' , inner: 45,outer:67,thickness:7},
  //   { no:'40×62×7' , inner: 40,outer:62,thickness:7 },
  //   { no:'40×62×10' , inner: 40,outer:62,thickness:10 },
  //   { no:'35×65×10' , inner: 35,outer:65,thickness:10},
  //   { no:'52×65×8' , inner: 52,outer:65,thickness:8},
  //   { no:'50×65×8' , inner: 50,outer:65,thickness:8 },
  //   { no:'50×65×9' , inner: 50,outer:65,thickness:9 },
  //   { no:'39.5×60×10' , inner: 39.5,outer:60,thickness:10 },
  //   { no:'51×66×9' , inner: 51,outer:66,thickness:9 },
  //   { no:'51×66×7' , inner: 51,outer:66,thickness:7 },
  //   { no:'48×68×8' , inner: 48,outer:68,thickness:8 },
  //   { no:'35×68×12' , inner: 35,outer:68,thickness:12 },
    
  //   { no:'50×70×13' , inner: 50,outer:70,thickness:13 },
  //   { no:'50×70×9' , inner: 50,outer:70,thickness:9 },
  //   { no:'50×75×10' , inner: 50,outer:75,thickness:10 },
  //   { no:'35×72×10' , inner: 35,outer:72,thickness:10 },
  //   { no:'50×72×10' , inner: 50,outer:72,thickness:10 },
  //   { no:'50×72×9' , inner: 50,outer:72,thickness:9 },
  //   { no:'46×78×10' , inner: 46,outer:78,thickness:10 },
  //   { no:'28×72×10' , inner: 28,outer:72,thickness:10 },
  //   { no:'40×72×10' , inner: 40,outer:72,thickness:10 },
  //   { no:'40×70×10' , inner: 40,outer:70,thickness:10 },
  //   { no:'51×70×11' , inner: 51,outer:70,thickness:11 },
  //   { no:'55×78×12' , inner: 55,outer:78,thickness:12 },
  //   { no:'45×75×12' , inner: 45,outer:75,thickness:12 },
  //   { no:'55×72×10' , inner: 55,outer:72,thickness:10 },
  //   { no:'42×72×10' , inner: 42,outer:72,thickness:10 },
  //   { no:'52×70×10' , inner: 52,outer:70,thickness:10 },
  //   { no:'52×75×12' , inner: 52,outer:75,thickness:12 },
  //   { no:'52×72×10' , inner: 52,outer:72,thickness:10 },
  //   { no:'30×72×10' , inner: 30,outer:72,thickness:10 },
  //   { no:'40×75×12' , inner: 40,outer:75,thickness:12 },
  //   { no:'48×70×9' , inner: 48,outer:70,thickness:9 },
  //   { no:'48×70×12' , inner: 48,outer:70,thickness:12 },
  //   { no:'50×72×10' , inner: 50,outer:72,thickness:10 },
  //   { no:'60×76×7' , inner: 60,outer:76,thickness:7 },
  //   { no:'52×75×12' , inner: 52,outer:75,thickness:12 },
  //   { no:'45×70×10' , inner: 45,outer:70,thickness:10 },
  //   { no:'58×78×10' , inner: 58,outer:78,thickness:10 },
  //   { no:'38×74×10/12' , inner: 38,outer:74,thickness:10 },
  //   { no:'44×78×10/16' , inner: 44,outer:78,thickness:10 },
  //   { no:'52×76×10' , inner: 52,outer:76,thickness:10 },
  //   { no:'54×75.5×/' , inner: 54,outer:75.5,thickness:10 },

  //   { no:'65×84×9' , inner: 65,outer:84,thickness:9 },
  //   { no:'35×80×10' , inner: 35,outer:80,thickness:10 },
  //   { no:'62×85×12.5' , inner: 62,outer:85,thickness:12.5 },
  //   { no:'55×85×10' , inner: 55,outer:85,thickness:10 },
  //   { no:'48×82×12' , inner: 48,outer:82,thickness:12 },
  //   { no:'50×82×12' , inner: 50,outer:82,thickness:12 },
  //   { no:'65×80×10' , inner: 65,outer:80,thickness:10 },
  //   { no:'68×88×10' , inner: 68,outer:88,thickness:10 },
  //   { no:'55×80×13' , inner: 55,outer:80,thickness:13 },
  //   { no:'55×80×10' , inner: 55,outer:80,thickness:10 },
  //   { no:'54×81×10' , inner: 54,outer:81,thickness:10 },
  //   { no:'60×82×10' , inner: 60,outer:82,thickness:10 },
  //   { no:'60×80×12' , inner: 60,outer:80,thickness:12 },
  //   { no:'60×80×10' , inner: 60,outer:80,thickness:10 },
  //   { no:'48×80×12' , inner: 48,outer:80,thickness:12 },
  //   { no:'40×80×12' , inner: 40,outer:80,thickness:12 },
  //   { no:'54×82×10' , inner: 54,outer:82,thickness:10 },
  //   { no:'65×85×10' , inner: 65,outer:85,thickness:10 },
  //   { no:'70×88×12' , inner: 70,outer:88,thickness:12 },

  //   { no:'72×90×8' , inner: 72,outer:90,thickness:8 },
  //   { no:'80×96×9' , inner: 80,outer:96,thickness:9 },
  //   { no:'72×90×8' , inner: 72,outer:90,thickness:8 },
  //   { no:'80×96×9' , inner: 80,outer:96,thickness:9 },
  //   { no:'72×94×10' , inner: 72,outer:94,thickness:10 },
  //   { no:'80×98×10' , inner: 80,outer:98,thickness:10 },
  //   { no:'72×90×9' , inner: 72,outer:90,thickness:9 },

  //   { no:'75×100×13' , inner: 75,outer:100,thickness:13 },
  //   { no:'100×125×13' , inner: 100,outer:125,thickness:13 },
  //   { no:'85×100×10' , inner: 85,outer:100,thickness:10 },
  //   { no:'85×102×13' , inner: 85,outer:102,thickness:13 },
  //   { no:'95×115×12' , inner: 95,outer:115,thickness:12 },
  //   { no:'85×105×13' , inner: 85,outer:105,thickness:13 },
  //   { no:'100×120/158×16' , inner: 100,outer:120,thickness:16 },
  //   { no:'105×125×12' , inner: 105,outer:125,thickness:12 },
  //   { no:'75×108×10' , inner: 75,outer:108,thickness:10 },
  //   { no:'70×100×15' , inner: 70,outer:100,thickness:15 },
  //   { no:'80×100×10' , inner: 80,outer:100,thickness:10 },
  //   { no:'80×100×13' , inner: 80,outer:100,thickness:13 },
  //   { no:'72×100×13' , inner: 72,outer:100,thickness:13 },
  //   { no:'95×105×13' , inner: 95,outer:100,thickness:13 },
  //   { no:'90×115×13' , inner: 90,outer:105,thickness:13 },
  //   { no:'96×113/146×16' , inner: 96,outer:115,thickness:16 },
  //   { no:'102×125×13' , inner: 102,outer:113,thickness:13 },
  //   { no:'65×100×10' , inner: 65,outer:100,thickness:10 },
  //   { no:'60×100×10' , inner: 60,outer:100,thickness:10 },
  //   { no:'80×105×10' , inner: 80,outer:105,thickness:10 },
  //   { no:'75×100×10' , inner: 75,outer:100,thickness:10 },
  //   { no:'100×120×13' , inner: 100,outer:120,thickness:13 },
  //   { no:'90×110×13' , inner: 90,outer:110,thickness:13 },
  //   { no:'84×104×11' , inner: 84,outer:104,thickness:11 },
  //   { no:'92×111×19' , inner: 92,outer:111,thickness:19 },
  //   { no:'85×110×13' , inner: 85,outer:110,thickness:13 },
  //   { no:'75×121×13' , inner: 75,outer:121,thickness:13},
  //   { no:'80×122×10/18' , inner: 80,outer:122,thickness:10 },
  //   { no:'84×127×13' , inner: 84,outer:127,thickness:13 },
  //   { no:'70×112×10/18.5' , inner: 70,outer:112,thickness:10 },
  //   { no:'90×135×13' , inner: 90,outer:135,thickness:13 },
    
  // ];
// .subscribe(snapshots=>{
      //   snapshots.forEach(snapshot => {
      //     this.removeProduct(snapshot)
          // this.informations.push({name:snapshot.name,info:snapshot.info})
      //   }); 
      // })
  // this.oilseals.forEach(e=>{
  //     this.oilsealinfo.push({
  //           no:e.no,inner:e.inner,outer:e.outer,thickness:e.thickness
  //         })  
  // })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BearingPage');
  }
gotoHome(){
    this.navCtrl.push(HomePage)
  }
   
  addOilsealInfo(){
    if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }
  let prompt = this.alertCtrl.create({
    title: 'إدخال بيانات أويل سيل',
    message: "أدخل المقاس الداخلي و الخارجي و السمك",
    inputs: [
      {
        name: 'no',
        placeholder: ' مقاس اﻷويل سيل'
      },
    {
        name: 'inner',
        placeholder: 'داخلي'
      },
    {
        name: 'outer',
        placeholder: 'خارجي'
      },
    {
        name: 'thickness',
        placeholder: 'السمك'
      },
      {
        name: 'notes',
        placeholder: 'ملاحظات أو الاستخدام'
      },
      
    ],
    buttons: [
      {
        text: 'ألغاء',
        handler: data => {
          console.log('Cancel clicked');
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.no==""||data.inner==""||data.outer==""||data.thickness==""){            
              let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون أي بيان خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.oilsealinfo.push({
            no:data.no,inner:data.inner,outer:data.outer,thickness:data.thickness,notes:data.notes
          }).then(
            //  if (this.platform.is('android')) {        
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    // }
         )
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
          this.removeOileal(item);
        }
      },{
        text: 'تعديل',
        handler: () => {
          this.updateOilsealInfo(item);
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
updateOilsealInfo(item){
  if (this.platform.is('android')) {        
        this.screenOrientation.unlock();
    }

  let prompt = this.alertCtrl.create({
    title: 'تعديل بيانات أويل سيل',
    message: "فضلاً تاكد من صحة البيانات التالية",
    inputs: [
      {
        name: 'no',
        placeholder: 'مقاس الاويل سيل ',
        value: item.no
      },
      {
        name: 'inner',
        placeholder: 'داخلي',
        value: item.inner
      },
   
    {
        name: 'outer',
        placeholder: 'خارجي',
        value: item.outer
      },
    {
        name: 'thickness',
        placeholder: 'سمك',
        value: item.thickness
      },
     {
        name: 'notes',
        placeholder: 'ملاحظات او الاستخدام',
        value: item.notes
      },
    ],
    buttons: [
      {
        text: 'إلغاء',
        handler: data => {
          console.log('Cancel clicked');
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        }
      },
      {
        text: 'حفظ',
        handler: data => {
           if(data.no==""||data.inner==""||data.outer==""||data.thickness==""){
                console.log(data);
                 let erralert = this.alertCtrl.create({
              title: 'عفواً',
              subTitle: 'لا يمكن ان يكون أي بيان خالياً!',
              buttons: ['موافق']
            });
          erralert.present();
                return
           }
          this.oilsealinfo.update(item.$key ,{no:data.no,inner: data.inner,outer: data.outer,thickness: data.thickness,notes: data.notes})
          .then(
            //  if (this.platform.is('android')) {        
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY)
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY)
    // }
         )
        }
      }
    ]
  });
  prompt.present();
}

removeOileal(item){
    this.oilsealinfo.remove(item.$key).then(
            this.notifications.push({
            text: item.no,action:"حذف",class:"أويل سيل"
          })
          );;
}

}
