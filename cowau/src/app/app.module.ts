import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//components
import { MyApp } from './app.component';
import { IdlePage } from '../pages/idle/idle';

//services
import { GesturesService } from '../services/gestures.service';

@NgModule({
  declarations: [
    MyApp,
    IdlePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IdlePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GesturesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
