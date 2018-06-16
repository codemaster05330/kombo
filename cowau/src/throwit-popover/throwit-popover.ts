import { Component, ViewChild } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Component({
	selector: 'throw-it-popover',
	templateUrl: 'throwit-popover.html'
})

export class ThrowItPopoverPage {
	constructor(public popoverCtrl: PopoverController) { }

	videoSource:string = 'assets/anim/throwit_android.mp4';
	
	@ViewChild('videoPlayer') videoplayer: any;

	ionViewWillEnter() {
		this.playVid();
	}

	public playVid() {
		this.videoplayer.nativeElement.play();
		this.videoplayer.nativeElement.loop = true;
	}
}
