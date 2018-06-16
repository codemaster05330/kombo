import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
//pages
import { IdlePage } from '../idle/idle';
import { FlipitPage } from '../flipit/flipit';

//classes
import { GestureType } from '../../classes/gesture-type';
import { Variables } from '../../classes/variables';

//services
import { GesturesService } from '../../services/gestures.service';

//server
import { Socket } from 'ng-socket-io';

@Component({
	selector: 'page-emoji',
	templateUrl: 'emoji.html',
})

export class EmojiPage {
	lookOfEvents:Array<GestureType> = [GestureType.IDLE_IN];
	emoji_list:Array<any>;

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
		this.socket.emit('get-emojis', null);
		this.getEmojiList();
	}

	getEmojiList(){
		// let observable = new Observable(observer => {
			this.socket.on('emojis-get', (data) => {
				this.emoji_list = data;
			});
		// });

		// return observable;
	}

	//click event
	clickMe(evt: MouseEvent){
		var elem: HTMLDivElement = <HTMLDivElement> evt.currentTarget;

		if(elem == null) { return; }
		if(elem.classList.contains("disabled")) { return; }

		this.globalVars.emojiID = parseInt(elem.id);
		console.log(this.globalVars.emojiID);
		this.socket.emit('take-emoji', this.globalVars.emojiID);
		this.zone.run(() => {
    		this.navCtrl.setRoot(FlipitPage);
		});
    }

    ionViewWillLeave() {
        console.log('will close emoji');
    }

    ionViewDidLeave() {
        console.log('closed emoji');
    }

}
