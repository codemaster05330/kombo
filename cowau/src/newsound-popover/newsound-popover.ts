import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { SoundType, SoundName } from '../classes/sequence';
import { Variables } from '../classes/variables'; 

@Component({
	selector: 'new-sound-popover',
	templateUrl: 'newsound-popover.html'
})

 export class NewSoundPopoverPage {
	constructor(public popoverCtrl: PopoverController, public globalVars: Variables) {}

	soundname: String = SoundName[this.globalVars.currentSoundType];

}
