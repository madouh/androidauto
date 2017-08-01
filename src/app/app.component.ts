import { Component, ViewChild } from '@angular/core';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  orders:FirebaseListObservable<any>;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public af: AngularFireDatabase, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.watch();
    // used for an example of ngFor and navigation
    
    this.pages = [
      { title: 'الرئيسية', component: HomePage },
      { title: 'مبيعات', component: SellPage },
      { title: 'طلبات الكماليات', component: AcessoirPage },
      { title: 'طلبات المسامير', component: MosmarPage },
      { title: 'طلبات الفيات', component: FaitPage },
      { title: 'طلبات الملاكي', component: MallakyPage },
      { title: 'طلبات عقل', component: AklPage },
      { title: 'طلبات الكهرباء', component: HomePage },
      { title: 'طلبات البلي', component: BearingPage },
      { title: 'طلبات الأويل سيل', component: OilsealPage },
      { title: 'طلبات  السيور', component: BeltPage },
      { title: 'طلبات السيكن', component: SeikienPage },
      { title: 'طلبات الياباني', component: JapanPage },
      { title: 'البيع اﻵجل ', component: AgelPage },
      { title: ' الميزانية ', component: BudgetPage },
      { title: 'إجمالي الطلبات', component: ListPage }
    ];

  }

watch(){
   this.orders = this.af.list('/orders');
    this.orders.$ref.on("value", function(snapshot) {
      console.log("Child is added...")
    })
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
