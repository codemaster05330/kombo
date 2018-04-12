import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Component({
	selector: 'new-sound-popover',
	templateUrl: 'newsound-popover.html'
})

 export class NewSoundPopoverPage {
	constructor(public popoverCtrl: PopoverController) {}
}
