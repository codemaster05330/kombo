import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { MetricSync } from '../../services/metric-sync.service';
import { Socket } from 'ng-socket-io';
import { ServerConnectionService } from '../../services/server-connection.service';
import { AudioBufferLoader } from 'waves-loaders';

// Import the pages, that are needed for this page
import { IdlePage } from '../idle/idle';
import { VisualPage } from '../visual/visual';
import { EditPage } from '../edit/edit';

// Import every classes
import { Variables } from '../../classes/variables';


import * as soundsData from '../../assets/sounds/sounds.json';

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

    		this.server.initServerConnection().then(() => {
				this.globalVars.audioBufferLoader = new AudioBufferLoader();
				var soundsArrayString = [];

				soundsData[0].forEach(soundsData => {
					soundsArrayString = soundsArrayString.concat(soundsData.path);   		// New "big" Sound Array
					this.globalVars.soundLengths = this.globalVars.soundLengths.concat(soundsData.length);
				});

				this.globalVars.audioBufferLoader.load(soundsArrayString)                                          // Load every Sound
				.then((buffers) => {
					const sendFunction = (cmd, ...args) => this.socket.emit(cmd, ...args);
					const receiveFunction = (cmd, args) => this.socket.on(cmd, args);
					this.globalVars.buffers = buffers;
					this.metricSync.start(sendFunction, receiveFunction).then((data) => {
						console.log(data);
						console.log("metricSyncStarted");
						this.zone.run(() => {
							this.navCtrl.setRoot(IdlePage);
						})
					});
				});

			});
    	}
    }
}
