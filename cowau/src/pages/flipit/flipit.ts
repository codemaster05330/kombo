import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PopoverPage } from '../../popover/popover';
import { PopoverController } from 'ionic-angular';
import { GesturesService } from '../../services/gestures.service';

/**
 * Generated class for the FlipitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-flipit',
	templateUrl: 'flipit.html',
})

export class FlipitPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, private gesturesService:GesturesService, public popoverCtrl: PopoverController) {}

	ionViewDidLoad() {
		// this.gesturesService.isFlipItGesture();
		
		// +++ Load popover on page load +++
		// let popover = this.popoverCtrl.create(PopoverPage);
        // popover.present();
	}

	// +++ Load popover on click event +++
	// presentPopover(myEvent) {
	// 	let popover = this.popoverCtrl.create(PopoverPage);
	// 	popover.present({
	// 		ev:myEvent
	// 	});
	// }
  
  
}
