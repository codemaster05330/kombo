import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

//pages
import { IdlePage } from '../idle/idle';
import { EditPage } from '../edit/edit';
 
//classes
import { GestureType } from '../../classes/gesture-type';
import { Variables } from '../../classes/variables';

//services
import { GesturesService } from '../../services/gestures.service';

//server
import { Socket } from 'ng-socket-io';

@Component({
	selector: 'page-switch-sound',
	templateUrl: 'switch-sound.html'
})

export class SwitchSoundPage {
	lookOfEvents:Array<GestureType> = [GestureType.IDLE_IN];
	sound_list:Array<any>;

	constructor(
		private zone:NgZone,
		private navCtrl: NavController,
		public navParams: NavParams,
		private events:Events,
		public globalVars: Variables,
		private gesturesService:GesturesService,
		private socket:Socket) {

		console.log('emoji constructor');

		this.gesturesService.watchForGesture(this.lookOfEvents);
		events.subscribe(GestureType.IDLE_IN.toString(), (acceleration) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			zone.run(() => {
				navCtrl.setRoot(IdlePage);
			});
		});

		// this.initServerConnection();
		// this.socket.emit('get-emojis', null);
		// this.getEmojiList();
	}

	getSoundList() {
		
	}

    ionViewWillLeave() {
        console.log('will close emoji');
    }

    ionViewDidLeave() {
        console.log('closed emoji');
    }

}
