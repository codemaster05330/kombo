import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule/*, Popover*/ } from 'ionic-angular';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://141.28.105.183:3001', options: {} };
// const config: SocketIoConfig = { url: 'http://192.168.0.11:3001', options: {} };

import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DeviceMotion } from '@ionic-native/device-motion';
// import { HTTP } from '@ionic-native/http';
import { Vibration } from '@ionic-native/vibration';

import './rxjs-extensions';

//components
import { MyApp } from './app.component';
import { FlipitPage } from '../pages/flipit/flipit';
import { IdlePage } from '../pages/idle/idle';
import { EmojiPage } from '../pages/emoji/emoji';
import { EditPage } from '../pages/edit/edit';
import { LoadingPage } from '../pages/load/load';
import { SwitchSoundPage } from '../pages/switch-sound/switch-sound';

//popovers
import { NewSoundPopoverPage } from '../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../throwit-popover/throwit-popover';

import { VisualPage } from '../pages/visual/visual';

//services
import { GesturesService } from '../services/gestures.service';
import { MetricSync } from '../services/metric-sync.service';
import { ServerConnectionService } from '../services/server-connection.service';

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
    NewSoundPopoverPage,
    ThrowItPopoverPage,
    LoadingPage,
    SwitchSoundPage
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
    NewSoundPopoverPage,
    ThrowItPopoverPage,
    LoadingPage,
    SwitchSoundPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DeviceMotion,
    GesturesService,
    Variables,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MetricSync,
    ServerConnectionService,
    Vibration
  ]
})
export class AppModule {}
