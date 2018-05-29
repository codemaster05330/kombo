import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FlipitPage } from '../pages/flipit/flipit';
import { IdlePage } from '../pages/idle/idle';
import { EditPage } from '../pages/edit/edit';
import { EmojiPage } from '../pages/emoji/emoji';
import { VisualPage } from '../pages/visual/visual';

@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	rootPage:any = VisualPage;
	// rootPage:any = ServerPage;

	constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
		});
	}
}
