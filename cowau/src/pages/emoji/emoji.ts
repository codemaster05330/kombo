import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';

//pages
import { IdlePage } from '../idle/idle';
import { FlipitPage } from '../flipit/flipit';


//classes
import { GestureType } from '../../classes/gesture-type';
import { Variables } from '../../classes/variables';

//services
import { GesturesService } from '../../services/gestures.service';

/**
 * Generated class for the EmojiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
	selector: 'page-emoji',
	templateUrl: 'emoji.html',
})
export class EmojiPage {
	lookOfEvents:Array<GestureType> = [GestureType.IDLE_IN];

	constructor(public navCtrl: NavController, public navParams: NavParams, private platform:Platform, private events:Events,
			public globalVars: Variables, private gesturesService:GesturesService) {
		platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				this.gesturesService.watchForGesture(this.lookOfEvents);
			}
		});
		events.subscribe(GestureType.IDLE_IN.toString(), (acceleration) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			this.navCtrl.setRoot(IdlePage);
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EmojiPage');
		this.isDisabled(this.id);
	}

	//simulates server information
	id : boolean[] = [true, true, false, false, true, true, false, false, false, false, false, true];

	//checks if emojis are occupied
	isDisabled (id: boolean[]) {

		for(var i = 0; i < id.length; i++) {
			let emojiHtmlElement = document.getElementById(i.toString());

			if(id[i] == true) {
				emojiHtmlElement.classList.add("disabled");
			} else { 
				emojiHtmlElement.classList.remove("disabled");
			}
		}
	}

	//click event
	clickMe(evt: MouseEvent){
		// console.log(evt.currentTarget);
		var elem: HTMLDivElement = <HTMLDivElement> evt.currentTarget;

		if(elem.classList.contains("disabled")){
    		return;
    	}

		this.globalVars.emojiID = Number(elem.id);
    	this.navCtrl.setRoot(FlipitPage);	
    }
}

		





	
