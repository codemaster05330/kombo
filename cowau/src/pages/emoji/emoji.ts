import { Component, Injectable } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

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
		private navCtrl: NavController,
		public navParams: NavParams,
		private events:Events,
		public globalVars: Variables,
		private gesturesService:GesturesService,
		private socket:Socket) {

		this.gesturesService.watchForGesture(this.lookOfEvents);
		events.subscribe(GestureType.IDLE_IN.toString(), (acceleration) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			this.navCtrl.setRoot(IdlePage);
		});


		// this.initServerConnection();
		this.socket.emit('get-emojis', null);
		this.getEmojiList();
	}

	ionViewDidLoad() {
		// console.log('ionViewDidLoad EmojiPage');
		// this.hideEmojis();
	}

	// initServerConnection() {
 //        const socket = this.socket;

 //    	socket.connect();
 //    	socket.emit('request');

 //        // client/server handshake
 //        const promise = new Promise((resolve, reject) => {
 //            socket.on('acknowledge', (data) => {
 //                console.log('Connected to server!');
 //                resolve();
 //            });
 //        });

 //        return promise;
 //    }

	getEmojiList(){
		// let observable = new Observable(observer => {
			this.socket.on('emojis-get', (data) => {
				this.emoji_list = data;
			});
		// });

		// return observable;
	}

	//simulates server information
	//id : boolean[] = [true, true, false, false, true, true, false, false, false, false, false, true];

	//checks if emojis are occupied
	// isDisabled (id: boolean[]) {
	// 	console.log('disabling emojis');
	// 	for(var i = 0; i < id.length; i++) {
	// 		let emojiHtmlElement = document.getElementById(i.toString());

	// 		if(id[i] == true) {
	// 			emojiHtmlElement.classList.add("disabled");
	// 		} else {
	// 			emojiHtmlElement.classList.remove("disabled");
	// 		}

	// 		emojiHtmlElement.style.display = "block";
	// 	}
	// }

	//click event
	clickMe(evt: MouseEvent){
		var elem: HTMLDivElement = <HTMLDivElement> evt.currentTarget;

		if(elem.classList.contains("disabled")){
    		return;
    	}

		this.globalVars.emojiID = parseInt(elem.id);
		console.log(this.globalVars.emojiID);
		this.socket.emit('take-emoji', this.globalVars.emojiID);
    	this.navCtrl.setRoot(FlipitPage);
    }

}
