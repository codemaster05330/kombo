import { Component } from '@angular/core';
import { NavController, NavParams, Platform, PopoverController, ViewController } from 'ionic-angular';
import { Popover } from '../../classes/popover';
import { GesturesService } from '../../services/gestures.service';
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';

//natives
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';


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
		public popoverCtrl:PopoverController, public viewCtrl:ViewController, public devMotion:DeviceMotion) {
		this.popover = new Popover(popoverCtrl, viewCtrl);
		
		platform.ready().then((readySource) => {
			if(readySource == 'cordova') {
				this.devMotion.watchAcceleration({frequency: 50}).subscribe((data:DeviceMotionAccelerationData) => {
					// console.log(this.gesturesService.isFlipItGesture(data));
				});
				// console.log('subscription' + this.motion_subscription);
				
				// if(this.gesturesService.isFlipItGesture()) {
				// 	console.log('FLIPPED');
				// }
				// this.gesturesService.isFlipItGesture();
			}
		});
	}

	ionViewDidLoad() {
		// this.gesturesService.isFlipItGesture();
		this.popover.show(NewSoundPopoverPage, 3000);
	}

	// showPopover() {
	// 	let popover = this.popoverCtrl.create(PopoverPage);
    //     popover.present();
	// }

	// +++ Load popover on click event +++
	// presentPopover(myEvent) {
	// 	let popover = this.popoverCtrl.create(PopoverPage);
	// 	popover.present({
	// 		ev:myEvent
	// 	});
	// } 
}