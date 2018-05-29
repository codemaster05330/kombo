import { PopoverController, PopoverCmp } from 'ionic-angular';
import { NewSoundPopoverPage } from '../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../throwit-popover/throwit-popover';
import { SoundType } from './sequence';


export class Popover {

	constructor(public popoverCtrl:PopoverController) {	}

	public show(p:any, timeout) {
		let pop = this.popoverCtrl.create(p);
		pop.present();
		this.close(pop, timeout);
	} 
	// Todo: insert dynamic soundname parameter.

	public close(pop, timeout) {
		setTimeout(function(){pop.dismiss()}, timeout);
	}
}