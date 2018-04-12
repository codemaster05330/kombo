import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Component({
	selector: 'throw-it-popover',
	templateUrl: 'throwit-popover.html'
})

 export class ThrowItPopoverPage {
	constructor(public popoverCtrl: PopoverController) {}
}
