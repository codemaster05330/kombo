import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Popover } from 'ionic-angular';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Gyroscope } from '@ionic-native/gyroscope';
import { DeviceMotion } from '@ionic-native/device-motion';
import { HTTP } from '@ionic-native/http';

import './rxjs-extensions';

//components
import { MyApp } from './app.component';
import { FlipitPage } from '../pages/flipit/flipit';
import { IdlePage } from '../pages/idle/idle';
import { EmojiPage } from '../pages/emoji/emoji';
import { EditPage } from '../pages/edit/edit';

//popovers
import { NewSoundPopoverPage } from '../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../throwit-popover/throwit-popover';

import { VisualPage } from '../pages/visual/visual';
import { ServerPage } from '../pages/server/server';

//services
import { GesturesService } from '../services/gestures.service';

import { ClientMetricSync } from '../services/metric-sync.client.service';
// import { ServerMetricSync } from '../services/metric-sync.server.service';

//classes
import { Variables } from '../classes/variables';

@NgModule({
  declarations: [
    MyApp,
    EmojiPage,
    FlipitPage,
    IdlePage,
    EditPage,
    VisualPage,
    ServerPage,
    NewSoundPopoverPage,
    ThrowItPopoverPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EmojiPage,
    FlipitPage,
    IdlePage,
    EditPage,
    VisualPage,
    ServerPage,
    NewSoundPopoverPage,
    ThrowItPopoverPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Gyroscope,
    DeviceMotion,
    GesturesService,
    Variables,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ClientMetricSync,
	// ServerMetricSync
  ]
})
export class AppModule {}

