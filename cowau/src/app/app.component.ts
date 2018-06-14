import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerConnectionService } from '../services/server-connection.service';

// NOTE: Auskommentiert da es sonnst unused ist.
import { Variables } from '../classes/variables';
// import { FlipitPage } from '../pages/flipit/flipit';
import { IdlePage } from '../pages/idle/idle';
// import { EditPage } from '../pages/edit/edit';
// import { EmojiPage } from '../pages/emoji/emoji';
// import { VisualPage } from '../pages/visual/visual';
import { Socket } from 'ng-socket-io';

@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	rootPage:any = IdlePage;
	// rootPage:any = ServerPage;

	@ViewChild('navCtrl') navCtrl:NavController;

	constructor(public server:ServerConnectionService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, socket:Socket,
		globalVars:Variables) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.hide();

			this.server.initServerConnection();

			platform.pause.subscribe(() => {
				if(globalVars.emojiID != null) {
					socket.emit('free-emoji', globalVars.emojiID);
					globalVars.emojiID = null;
				}
			});

			platform.resume.subscribe(() => {
				if(this.navCtrl.getActive().name != 'IdlePage') {
					this.navCtrl.setRoot(IdlePage);
				}
			});
		});
	}
}
