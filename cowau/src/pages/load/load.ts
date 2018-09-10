import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { MetricSync } from '../../services/metric-sync.service';
import { Socket } from 'ng-socket-io';
import { ServerConnectionService } from '../../services/server-connection.service';
import { AudioBufferLoader } from 'waves-loaders';
import { audioContext } from 'waves-audio';

// Import the pages, that are needed for this page
import { IdlePage } from '../idle/idle';
import { VisualPage } from '../visual/visual';
import { EditPage } from '../edit/edit';
import { SwitchSoundPage } from '../switch-sound/switch-sound';

// Import every classes
import { Variables } from '../../classes/variables';

import * as soundsData from '../../assets/sounds/sounds.json';

function activateAudioContext() {
  const g = audioContext.createGain();
  g.connect(audioContext.destination);
  g.gain.value = 0;

  const o = audioContext.createOscillator();
  o.connect(g);
  o.frequency.value = 20;
  o.start(0);
}

@Component({
	selector: 'page-load',
	templateUrl: 'load.html',
})

export class LoadingPage {
	text : string = "click here";
	isLoading: boolean = false;

    constructor(private navCtrl: NavController, private socket:Socket, private globalVars:Variables,
    	private metricSync:MetricSync, private server: ServerConnectionService, private zone:NgZone) {
        console.log("Loading Page");
    }

    onClick(){
    	if(!this.isLoading){
    		this.isLoading = true;
    		this.text = "Loading...";

            activateAudioContext();
            console.log("Step 1: Audio context activated");

    		this.server.initServerConnection().then(() => {
                console.log("Step 2: Connected to socket.io server");
				this.globalVars.audioBufferLoader = new AudioBufferLoader();
				var soundsArrayString = [];

				soundsData[0].forEach(soundsData => {
					soundsArrayString = soundsArrayString.concat(soundsData.path);   		// New "big" Sound Array
					this.globalVars.soundLengths = this.globalVars.soundLengths.concat(soundsData.length);
					this.globalVars.soundGains = this.globalVars.soundGains.concat(soundsData.gain);
					this.globalVars.cutSound = this.globalVars.cutSound.concat(soundsData.cut);
				});

                console.log("Step 3: Soundfile JSON is loaded");

				this.globalVars.audioBufferLoader.load(soundsArrayString)                                          // Load every Sound
				.then((buffers) => {
                    console.log('Step 4: Sounds files (MP3) loaded');
					const sendFunction = (cmd, ...args) => this.socket.emit(cmd, ...args);
					const receiveFunction = (cmd, args) => this.socket.on(cmd, args);
					this.globalVars.buffers = buffers;
					this.metricSync.start(sendFunction, receiveFunction).then((data) => {
						console.log("Step 5: Metric Sync Service is running.");
						this.zone.run(() => {
							this.navCtrl.setRoot(SwitchSoundPage);
						})
					});
				});

			});
    	}
    }
}
