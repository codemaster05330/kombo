import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Socket } from 'ng-socket-io';

import { MetricSync } from '../../services/metric-sync.service';
import { GesturesService } from '../../services/gestures.service';

// Import the pages, that are needed for this page
import { EmojiPage } from '../emoji/emoji';

// Import every classes
import { Variables } from '../../classes/variables';
import { GestureType } from '../../classes/gesture-type';
import { SoundWave } from '../../classes/sound-wave';

@Component({
	selector: 'page-idle',
	templateUrl: 'idle.html',
})

export class IdlePage {
	lookOfEvents:Array<GestureType>        = [GestureType.IDLE_OUT];
    soundWaves:Array<SoundWave>            = [];                                // The Soundwaves from this object
    cvs:any;                                                                    // Canvas Element
    ctx:any;                                                                    // Setup the Canvas to 2D
    ratio:number;                                                               // Define the DPI of the Screen
    canvasWidth:number;                                                         // Hight of the Canvas
    canvasHeight:number;                                                        // Width of the Canvas
	idleAnimationCanvas:any;													// Animation Frame FUnction
	setup:any = true;

    constructor(
        private zone: NgZone,
        private navCtrl: NavController,
        public navParams: NavParams,
        private events:Events,
        private socket:Socket,
        private gesturesService:GesturesService,
        private globalVars:Variables) {

        console.log('idle constructor');

				globalVars.currentSoundType = null;

        if(this.globalVars.emojiID != null) {
            console.log(globalVars.emojiID);
            this.socket.emit('free-emoji', globalVars.emojiID);
            this.globalVars.emojiID = null;
        }

		this.gesturesService.watchForGesture(this.lookOfEvents);

    	events.subscribe(GestureType.IDLE_OUT.toString(), (acceleration) => {
    		this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_OUT);
            this.zone.run(() => {
		        this.navCtrl.setRoot(EmojiPage);
            });
    	});

    }

	ionViewWillEnter() {
		this.draw();															// Start the Canvas Animation
		console.log('Enter Idle Page');
	}

    // Function that get triggert 60 times every second
    // so this function creaetes the animation in the background
    draw() {
		this.ratio = window.devicePixelRatio;                               	// Define the Pixel Ratio of the Device
		this.canvasWidth = window.innerWidth;                              		// Define the Width of the Device
		this.canvasHeight = window.innerHeight;                             	// Define the Hight of the Device
		this.cvs = document.getElementById('idle-canvas');                  	// Define the canvas tag
		this.ctx = this.cvs.getContext('2d');                               	// Define the canvas context

		// Create a canvas with the max size of the device
		// and create a canvas with a higher DPI as the "Max-Size"
		// so everything is sharp as fuck
		this.cvs.width = this.canvasWidth * this.ratio;                     	// Multiply the width, with the DPI Scale
		this.cvs.height = this.canvasHeight * this.ratio;                  	 	// Multiply the width, with the DPI Scal
		this.cvs.style.width = this.canvasWidth + 'px';                     	// Set the width in the canvas
		this.cvs.style.height = this.canvasHeight + 'px';                   	// Set the hight in the canvas
		this.canvasWidth = this.canvasWidth * this.ratio;                   	// Set the widdth of the canvas
		this.canvasHeight = this.canvasHeight * this.ratio;                 	// Set the hight of the canvas

		// This line clear the canvas every Frame,
		// without this line, every circles would stay
		this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
		if(this.returnRandomValue(1,50) == 7) {
			let soundWave = new SoundWave(5,this.returnRandomValue(5,15),this.canvasWidth/2,this.canvasHeight/2,1,this.ctx,this.canvasWidth,this.canvasHeight,this.ratio);
			this.soundWaves.push(soundWave);
		}
		this.soundWaves.forEach(soundWaves => {
			soundWaves.updateSoundWave();
			if(soundWaves.returnSoundWave() == 0) { this.soundWaves.splice(this.soundWaves.indexOf(soundWaves),1); }
		});

		// this line request this function every frame
		this.idleAnimationCanvas = window.requestAnimationFrame(() => {this.draw()});
    }

	// Function to create a random int number
	// with an min and max value
	returnRandomValue(min,max) {
		let random = Math.floor(Math.random() * (max-min + 1) + min );
		if(random === 0){
			return random = min;
		} else {
			return random;
		}
	}

    ionViewWillLeave() {
        console.log('will close idle');
		window.cancelAnimationFrame(this.idleAnimationCanvas);
    }

    ionViewDidLeave() {
        console.log('closed idle');
    }
}
