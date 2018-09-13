import { Component } from '@angular/core';
import { PopoverController, ViewController } from 'ionic-angular';
import { Variables } from '../classes/variables';

import * as soundsData from '../assets/sounds/sounds.json';

import * as audio from 'waves-audio';
const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
	selector: 'switch-sound-popover',
	templateUrl: 'switchsound-popover.html'
})

 export class SwitchSoundPopoverPage {
 	sound_list:any;

	constructor(public popoverCtrl: PopoverController, public globalVars: Variables, public viewCtrl:ViewController) {
		this.sound_list = soundsData[0];
		this.sound_list.forEach(function(s, i) {
			if(globalVars.currentSoundType == s.id) {
				s.focus = true;
			} else {
				s.focus = false;
			}
		});
	}

	selectSound(sound) {
		if(sound.focus) {
			this.globalVars.currentSoundType = sound.id;
			this.viewCtrl.dismiss();
		} else {
			this.sound_list.forEach(function(s, i) {
				s.focus = false;
			});
			sound.focus = true;
			this.playSounds(sound.id);
		}
	}

	playSounds(type:number) {
		for(let i: number = 0; i < 5; i++) {
			this.playSound(type, i);
		}
	}

	playSound(type: number, pitch: number){
		// Get Time from Server
		const time = audioScheduler.currentTime;	                            // Sync Time
		const src = audioContext.createBufferSource();                          // Create Source
		const gainC = audioContext.createGain();

		// Play Audio File
		gainC.connect(audioContext.destination);
		src.connect(gainC);                                  					// Connect Audio Context
		src.buffer = this.globalVars.buffers[type];                             // Define witch sound the function is playing
		let endTime;
        if (this.globalVars.cutSound[type]){
            endTime = 1 * 0.25;
        } else {
            endTime = 8 * 0.25;
        }
		src.start(time + pitch * 0.25 , pitch * 3, endTime + 0.1);									// Start Sound
		gainC.gain.value = this.globalVars.soundGains[type];

		gainC.gain.setTargetAtTime(0, time + (pitch + endTime * 4) * 0.25 - 0.05, 0.015);
	}

	decibelToLinear(value: number){
		return Math.pow(10, value/20);
	}

}
