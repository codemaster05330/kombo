import { Component } from '@angular/core';
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

	constructor(public navCtrl: NavController, public navParams: NavParams, private gesturesService:GesturesService, public platform:Platform, 
		public popoverCtrl:PopoverController, public events:Events) {
		this.popover = new Popover(popoverCtrl);
		
		platform.ready().then((readySource) => {
			if(readySource == 'cordova') {
				this.gesturesService.isFlipItGesture();
			}
		});

		events.subscribe('flipped', (acceleration) => {
			console.log('FLIPPED');
			this.popover.show(NewSoundPopoverPage, 3000);
			this.navCtrl.setRoot(EditPage);
		});
	}

	ionViewWillLeave() {
		this.gesturesService.stopFlipitWatch();
	}
}