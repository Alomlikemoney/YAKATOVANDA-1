import { SharedService } from './shared.service';
import { environment } from './../environments/environment.prod';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Server } from 'https';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReversePipe } from './mes-annonces/reverse.pipe';
import { HttpClientModule } from '@angular/common/http';
import {TabsComponent} from './tabs/tabs.component'
import { Storage } from '@ionic/storage';


export const firebaseConfig = {
  apiKey: "AIzaSyDo1YhZqucB1C9xdiDg_U4fh4_n5KyNpAg",
  authDomain: "yakatovanda.firebaseapp.com",
  databaseURL: "https://yakatovanda-default-rtdb.firebaseio.com",
  projectId: "yakatovanda",
  storageBucket: "yakatovanda.appspot.com",
  messagingSenderId: "137910672094",
  appId: "1:137910672094:web:58fd846e5d84e43f58404f",
  measurementId: "G-ZXWQ97EJC4"
};

@NgModule({
  declarations: [ReversePipe,AppComponent, TabsComponent],
  imports: [AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    IonicStorageModule.forRoot(),
    BrowserModule, IonicModule.forRoot(), FormsModule,  AppRoutingModule, IonicModule.forRoot()],
  providers: [Storage, SharedService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule {}
