import { Component } from '@angular/core';
import { ViewController, PopoverController } from 'ionic-angular';

@Component({
	selector: 'new-sound-popover',
	templateUrl: 'newsound-popover.html'
})

 export class NewSoundPopoverPage {
	constructor(public viewCtrl: ViewController, public popoverCtrl: PopoverController) {}
}
