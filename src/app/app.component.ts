import { Component, ViewChild,NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { FaitPage } from '../pages/fait/fait';
import { AcessoirPage } from '../pages/acessoir/acessoir';
import { MallakyPage } from '../pages/mallaky/mallaky';
import { SellPage } from '../pages/sell/sell';
import { AgelPage } from '../pages/agel/agel';
import { JapanPage } from '../pages/japan/japan';
import { BearingPage } from '../pages/bearing/bearing';
import { OilsealPage } from '../pages/oilseal/oilseal';
import { MosmarPage } from '../pages/mosmar/mosmar';
import { AklPage } from '../pages/akl/akl';
import { ElectricPage } from '../pages/electric/electric';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BudgetPage } from '../pages/budget/budget';
import { SeikienPage } from '../pages/seikien/seikien';
import { BeltPage } from '../pages/belt/belt';
import { LoginPage } from '../pages/login/login';
import { ContactsPage } from '../pages/contacts/contacts';
import { InvoicePage } from '../pages/invoice/invoice';
import { InvoicesPage } from '../pages/invoices/invoices';
import { AngularFireAuth } from 'angularfire2/auth';
import { Vibration } from '@ionic-native/vibration';
import { NotificationPage } from '../pages/notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications'; 
import { InformationPage } from '../pages/information/information';
import { BearingsinfoPage } from '../pages/bearingsinfo/bearingsinfo';
import { JointsinfoPage } from '../pages/jointsinfo/jointsinfo';
import { BeltsinfoPage } from '../pages/beltsinfo/beltsinfo';
import { OilsealsinfoPage } from '../pages/oilsealsinfo/oilsealsinfo';
import { FilterinfoPage } from '../pages/filterinfo/filterinfo';
import { SearchPage } from '../pages/search/search';
import { DepositePage } from '../pages/deposite/deposite';
import { ItemsPage } from '../pages/items/items';
import {ModalPage} from '../pages/modal/modal';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  orders:FirebaseListObservable<any>;
  notifications:FirebaseListObservable<any>;
  zone: NgZone; // declare the zone
  pages: Array<{title: string, component: any}>;
  firstTime = new Date().getTime();

  constructor(private localNotifications: LocalNotifications,private afAuth:AngularFireAuth, private vibration :Vibration,public platform: Platform,public af: AngularFireDatabase, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    console.log(this.firstTime)
    this.initializeApp();
    this.watch();
    // var firstTime: String = new Date().toLocaleTimeString();
    // used for an example of ngFor and navigation
    this.zone = new NgZone({});
const unsubscribe = afAuth.auth.onAuthStateChanged((user) => {
  this.zone.run(() => {
    if (user) {
      console.log(user)
      this.rootPage = HomePage;// HomePage;
      unsubscribe();
    } else {            
      this.rootPage = LoginPage;
      unsubscribe();
    } 
  }); 
});
    this.pages = [
      { title: 'البحث في الفواتير', component: SearchPage },
      { title: ' بيانات الموردين', component: ContactsPage },
      { title: 'طلبات الكماليات', component: AcessoirPage },
      { title: 'طلبات المسامير', component: MosmarPage },
      { title: 'طلبات الفيات', component: FaitPage },
      { title: 'طلبات الملاكي', component: MallakyPage },
      { title: 'طلبات عقل', component: AklPage },
      { title: 'طلبات الكهرباء', component: ElectricPage },
      { title: 'طلبات البلي', component: BearingPage },
      { title: 'طلبات الأويل سيل', component: OilsealPage },
      { title: 'طلبات  السيور', component: BeltPage },
      { title: 'طلبات السيكن', component: SeikienPage },
      { title: 'طلبات الياباني', component: JapanPage },
      { title: 'البيع اﻵجل ', component: AgelPage },
      { title: ' الميزانية ', component: BudgetPage },
      { title: 'إجمالي الطلبات', component: ListPage }, 
      { title: 'فاتورة جديدة', component: InvoicePage },
      { title: 'الفواتير', component: InvoicesPage },
      { title: 'معلومات', component: InformationPage },
      // { title: 'الإشعارات', component: NotificationPage },
      { title: 'مبيعات', component: SellPage },
      { title: 'بيانات السيور', component: BeltsinfoPage },
      { title: 'بيانات البلي', component: BearingsinfoPage },
      { title: 'بيانات اﻷويل سيل', component: OilsealsinfoPage },
      { title: 'بيانات الصلايب', component: JointsinfoPage },
      { title: 'يبانات الفلاتر ', component: FilterinfoPage },
      { title: 'قائمة اﻷصناف', component: ItemsPage },
      { title: 'أساس الدين', component: DepositePage },
      { title: 'خروج', component: LoginPage }
    ];

  }

watch(){
//   var secondTme = new Date().getTime();
//   console.log(secondTme)
// if((secondTme - this.firstTime>5000)){
  var vibrations=this.vibration
var xxx;
  //  this.orders = this.af.list('/orders');
   this.notifications = this.af.list('/notifications');
  this.notifications.$ref.limitToLast(1).on("value",function(snapshot){
       console.log(Object.keys(snapshot.val())[0])
       xxx=Object.keys(snapshot.val())[0];
  })

  this.notifications.$ref.limitToLast(1).on('value', snap=> {
      var secondTme = new Date().getTime();
  console.log(secondTme)
if((secondTme - this.firstTime>5000)){
    var xx=JSON.stringify(snap.val(), null, 3);
    let obj = JSON.parse(xx);
    for (var prop in snap.val()) {
        var xx=JSON.stringify(snap.val()[prop])
        let obj = JSON.parse(xx);
     this.localNotifications.schedule({
            text: "تم  "+obj["action"]+" "+ obj["text"] +" في"+" "+obj["class"]
          });
    //     for (var pro in obj) {
    //     console.log("Key:" + pro);
    //     console.log("Value:" + obj[pro]);
    // }
  }
  }
});
  //   this.notifications.$ref.limitToLast(1).once("value")
  // .then(function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) {
  //     var key = childSnapshot.key;
  //     var childData = childSnapshot.val();
      // console.log(childSnapshot.key)
      // console.log(childData.action)

//   });
// });
        vibrations.vibrate(300)
  //  })
    // this.orders.$ref.on("value", function(snapshot) {
    //    console.log(snapshot.val())
    //    vibrations.vibrate(300)
    //   //  this.notifications.push({
    //   //       name: data.name,number:data.number,class:"acessoir",orderDate:orderDate,orderTime:orderTime
    //   //     });
    // })
    //  }
}
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
