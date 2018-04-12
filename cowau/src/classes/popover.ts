import { PopoverController, ViewController, PopoverCmp } from 'ionic-angular';
import { NewSoundPopoverPage } from '../newsound-popover/newsound-popover';
//import { PopoverPage } from '../newsound-popover/newsound-popover';

export class Popover {

	constructor(public popoverCtrl:PopoverController, public viewCtrl:ViewController) {	}

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