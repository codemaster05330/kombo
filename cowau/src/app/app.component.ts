import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServerConnectionService } from '../services/server-connection.service';
import { AudioBufferLoader } from 'waves-loaders';
import { MetricSync } from '../services/metric-sync.service';

// NOTE: Auskommentiert da es sonnst unused ist.
import { Variables } from '../classes/variables';
// import { FlipitPage } from '../pages/flipit/flipit';
import { IdlePage } from '../pages/idle/idle';
import { LoadingPage } from '../pages/load/load';
import { EditPage } from '../pages/edit/edit';
// import { EmojiPage } from '../pages/emoji/emoji';
// import { VisualPage } from '../pages/visual/visual';
import { Socket } from 'ng-socket-io';


import * as soundsData from '../assets/sounds/sounds.json';

@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	rootPage:any = LoadingPage;
	// rootPage:any = ServerPage;

	@ViewChild('navCtrl') navCtrl:NavController;

	constructor(public server:ServerConnectionService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, socket:Socket,
		globalVars:Variables, private metricSync:MetricSync) {
		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.hide();

			this.server.initServerConnection().then(() => {
				globalVars.audioBufferLoader = new AudioBufferLoader();
				var soundsArrayString = [];

				soundsData[0].forEach(soundsData => {
					soundsArrayString = soundsArrayString.concat(soundsData.path);   		// New "big" Sound Array
					globalVars.soundLengths = globalVars.soundLengths.concat(soundsData.length);
				});

				globalVars.audioBufferLoader.load(soundsArrayString)                                          // Load every Sound
				.then((buffers) => {
					const sendFunction = (cmd, ...args) => socket.emit(cmd, ...args);
					const receiveFunction = (cmd, args) => socket.on(cmd, args);
					globalVars.buffers = buffers;
					metricSync.start(sendFunction, receiveFunction).then(() => {
						console.log("metricSyncStarted");
						this.navCtrl.setRoot(EditPage);
					});
				});

			});

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
