import { Component } from '@angular/core';
import { ViewController, PopoverController } from 'ionic-angular';

@Component({
	selector: 'throw-it-popover',
	templateUrl: 'throwit-popover.html'
})

 export class ThrowItPopoverPage {
	constructor(public viewCtrl: ViewController, public popoverCtrl: PopoverController) {}
}
