import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController, Events} from 'ionic-angular';
import { Popover } from '../../classes/popover';
import { GesturesService } from '../../services/gestures.service';
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../../throwit-popover/throwit-popover';
import { EditPage } from '../edit/edit';


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

	@ViewChild('videoPlayer') videoplayer: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, private gesturesService:GesturesService, public platform:Platform, 
		public popoverCtrl:PopoverController, private events:Events) {
		this.popover = new Popover(popoverCtrl);
		
		platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				// this.gesturesService.watchForGesture(false);
			}
		});

		events.subscribe('flipped', (acceleration) => {
			console.log('FLIPPED flipitpage');
			this.popover.show(NewSoundPopoverPage, 1000);
			setTimeout(() => {
				this.gesturesService.stopGestureWatch(this.events, 'flipped');
				this.navCtrl.setRoot(EditPage);
			}, 300);
		});
	}

	ionViewDidEnter() {
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