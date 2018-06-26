import { Component, ViewChild } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Component({
	selector: 'throw-it-popover',
	templateUrl: 'throwit-popover.html'
})

export class ThrowItPopoverPage {
	videoSource:string;
	@ViewChild('videoPlayer') videoplayer: any;

	constructor(public popoverCtrl: PopoverController) {
		this.videoSource = 'assets/anim/throwit_android.mp4';
	}

	public playVid() {
		this.videoplayer.nativeElement.play();
		this.videoplayer.nativeElement.loop = true;
	}
}
