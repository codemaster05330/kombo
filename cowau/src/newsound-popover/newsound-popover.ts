import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { SoundName } from '../classes/sequence';
import { Variables } from '../classes/variables'; 

@Component({
	selector: 'new-sound-popover',
	templateUrl: 'newsound-popover.html'
})

 export class NewSoundPopoverPage {
 	soundname:string;
	constructor(public popoverCtrl: PopoverController, public globalVars: Variables) {
		this.soundname = SoundName[this.globalVars.currentSoundType];
	}
}
