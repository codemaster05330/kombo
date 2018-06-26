import { Component, ViewChild } from '@angular/core';
import { PopoverController, ViewController } from 'ionic-angular';

@Component({
	selector: 'throw-it-popover',
	templateUrl: 'throwit-popover.html'
})

export class ThrowItPopoverPage {
	videoSource:string;
	@ViewChild('videoPlayer') videoplayer: any;
	
	constructor(public popoverCtrl: PopoverController, private viewCtrl:ViewController) {}

	public playVid() {
		this.videoplayer.nativeElement.play();
		this.videoplayer.nativeElement.loop = true;
	}

	closePopover() {
		this.viewCtrl.dismiss();
	}
}
