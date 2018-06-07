import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController, Events} from 'ionic-angular';

//pages
import { EditPage } from '../edit/edit';
import { IdlePage } from '../idle/idle';

//popovers
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../../throwit-popover/throwit-popover';

//services
import { GesturesService } from '../../services/gestures.service';

//classes
import { Popover } from '../../classes/popover';
import { GestureType } from '../../classes/gesture-type';
import { Variables } from '../../classes/variables';
import { SoundType } from '../../classes/sequence';


/**
 * Generated class for the FlipitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-flipit',
	templateUrl: 'flipit.html'
})

export class FlipitPage {
	popover:Popover;
	motion_subscription: any;
	videoSource:string = 'assets/anim/flipit_android.mp4';
	lookOfEvents:Array<GestureType> = [GestureType.FLIPPED, GestureType.IDLE_IN];

	@ViewChild('videoPlayer') videoplayer: any;

	constructor(private navCtrl: NavController, public navParams: NavParams, private gesturesService:GesturesService, public platform:Platform,
		public popoverCtrl:PopoverController, private events:Events, private globalVars: Variables) {
		this.popover = new Popover(popoverCtrl);
		
		this.gesturesService.watchForGesture(this.lookOfEvents);
		events.subscribe(GestureType.FLIPPED.toString(), (acceleration) => {
			globalVars.emojiID = SoundType[SoundType[Math.floor(Math.random() * Object.keys(SoundType).length / 2)]];
			this.popover.show(NewSoundPopoverPage, 1000);
			this.gesturesService.stopGestureWatch(this.events, GestureType.FLIPPED);
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			// setTimeout(function(){
				this.navCtrl.setRoot(EditPage);	
			// }, 200);
		});

		events.subscribe(GestureType.IDLE_IN.toString(), (acceleration) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			this.gesturesService.stopGestureWatch(this.events, GestureType.FLIPPED);
			this.navCtrl.setRoot(IdlePage);
		});
	}

	ionViewWillEnter() {
		this.playVid();
	}

	public switchScreen() {
        this.navCtrl.setRoot(EditPage);
	}

	public playVid() {
		// console.log("video");
		this.videoplayer.nativeElement.play();
		this.videoplayer.nativeElement.loop = true;
	}

}