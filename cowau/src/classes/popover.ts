import { PopoverController, ViewController } from 'ionic-angular';
import { NewSoundPopoverPage } from '../newsound-popover/newsound-popover';
//import { PopoverPage } from '../newsound-popover/newsound-popover';

export class Popover {
	constructor(public popoverCtrl:PopoverController, public viewCtrl:ViewController) {}
	
	public show(p:any) {
		let popover = this.popoverCtrl.create(p);
		popover.present();
		setTimeout(this.close, 3000);
	} 
	// Todo: insert dynamic soundname parameter.



	public close() {
		console.log("HALLLLOOOO");
		// this.viewCtrl.dismiss();
	  }
}