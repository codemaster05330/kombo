import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
// import: import { pageClass } from 'path to .ts file';
import { HomePage } from '../pages/home/home';
import { IdlePage } from '../pages/idle/idle';
import { FlipitPage } from '../pages/flipit/flipit';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    IdlePage,
    FlipitPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    IdlePage,
    FlipitPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
