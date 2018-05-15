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
	videoSource:string = '../../assets/anim/flipit_android.mp4';
	lookOfEvents:Array<GestureType> = [GestureType.FLIPPED, GestureType.IDLE_IN];

	@ViewChild('videoPlayer') videoplayer: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private gesturesService:GesturesService, public platform:Platform, 
		public popoverCtrl:PopoverController, private events:Events) {
		this.popover = new Popover(popoverCtrl);
		
		platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				this.gesturesService.watchForGesture(this.lookOfEvents);
			}
		});

		events.subscribe(GestureType.FLIPPED.toString(), (acceleration) => {
			console.log('FLIPPED flipitpage');
			this.popover.show(NewSoundPopoverPage, 1000);
			this.gesturesService.stopGestureWatch(this.events, GestureType.FLIPPED);
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			setTimeout(() => {
				this.navCtrl.setRoot(EditPage);
			}, 300);
		});

		events.subscribe(GestureType.IDLE_IN.toString(), (acceleration) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.FLIPPED);
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
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
		console.log("video");
		this.videoplayer.nativeElement.play();
		this.videoplayer.nativeElement.loop = true;
	}

}