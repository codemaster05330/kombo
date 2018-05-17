import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { MetricSync } from '../../services/metric-sync.service';
import { Socket } from 'ng-socket-io';
import { GesturesService } from '../../services/gestures.service';

// Import the pages, that are needed for this page
import { EmojiPage } from '../emoji/emoji';

// Import every classes
import { GestureType } from '../../classes/gesture-type';
import { audioContext } from 'waves-audio';
import { AudioBufferLoader } from 'waves-loaders';
import { SoundWave } from '../../classes/sound-wave';

import * as audio from 'waves-audio';
const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
  selector: 'page-idle',
  templateUrl: 'idle.html',
})

export class IdlePage {
	lookOfEvents:Array<GestureType>        = [];
    soundWaves:Array<SoundWave>            = [];                                // The Soundwaves from this object
    cvs:any;                                                                    // Canvas Element
    ctx:any;                                                                    // Setup the Canvas to 2D
    ratio:number;                                                               // Define the DPI of the Screen
    canvasWidth:number;                                                         // Hight of the Canvas
    canvasHeight:number;                                                        // Width of the Canvas

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private platform:Platform,
        private events:Events,
        private socket:Socket,
    	private metricSync:MetricSync,
        private gesturesService:GesturesService) {

        	platform.ready().then((readySource) => {
    			if(readySource == 'cordova' || readySource == 'mobile') {
    				this.gesturesService.watchForGesture(this.lookOfEvents);
    			}
    		});

        	events.subscribe(GestureType.IDLE_OUT.toString(), (acceleration) => {
        		this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_OUT);
        		setTimeout(() => {
        			this.navCtrl.setRoot(EmojiPage);
        		}, 500);
        	});
        }

    ionViewDidLoad() {
        this.ratio = window.devicePixelRatio;
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.cvs = document.getElementById('canvas');                           // Define the canvas tag
        this.ctx = this.cvs.getContext('2d');                                   // Define the canvas context

        // Create a canvas with the max size of the device
        // and create a canvas with a higher DPI as the "Max-Size"
        // so everything is sharp as fuck
        this.cvs.width = this.canvasWidth * this.ratio;                         // Multiply the width, with the DPI Scale
        this.cvs.height = this.canvasHeight * this.ratio;                       // Multiply the width, with the DPI Scal
        this.cvs.style.width = this.canvasWidth + 'px';                         // Set the width in the canvas
        this.cvs.style.height = this.canvasHeight + 'px';                       // Set the hight in the canvas
        this.canvasWidth = this.canvasWidth * this.ratio;                       // Set the widdth of the canvas
        this.canvasHeight = this.canvasHeight * this.ratio;                     // Set the hight of the canvas

        this.draw();

        this.initServerConnection().then(() => {
            this.initMetrics();
        });

    }

    initServerConnection() {
        const socket = this.socket;

    	socket.connect();
    	socket.emit('request');

        // client/server handshake
        const promise = new Promise((resolve, reject) => {
            socket.on('acknowledge', (data) => {
                console.log('Connected to server!');
                resolve();
            });
        });

        return promise;
    }

    initMetrics() {
        const socket = this.socket;
        const sendFunction = (cmd, ...args) => socket.emit(cmd, ...args);
        const receiveFunction = (cmd, ...args) => socket.on(cmd, ...args);
        const loader = new AudioBufferLoader();

        loader.load(['assets/sounds/909-BD-high.wav', 'assets/sounds/909-HH-open.wav'])
        .then((buffers) => {
            this.metricSync.start(sendFunction, receiveFunction).then(() => {
                this.metricSync.addMetronome((measure, beat) => {
                    const time = audioScheduler.currentTime;
                    const src = audioContext.createBufferSource();
                    src.connect(audioContext.destination);
                    src.buffer = (beat !== 7) ? buffers[0] : buffers[1];
                    src.start(time);
                    console.log('metro:', measure, beat);
                    let soundWave = new SoundWave(this.soundWaves,0,this.canvasWidth/2,this.canvasHeight/2,1,this.ctx,this.canvasWidth,this.canvasHeight,this.ratio);
                    this.soundWaves.push(soundWave);
                }, 8, 8);
            });
        }).catch(function(err) {
            console.log("loader error:", err.message);
        });
    }

    // Function that get triggert 60 times every second
    // so this function creaetes the animation in the background
    draw() {
        // This line clear the canvas every Frame,
        // without this line, every circles would stay
        this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.soundWaves.forEach(soundWaves => {
            soundWaves.updateSoundWave();
        });
        // this line request this function every frame
        requestAnimationFrame(() => {this.draw()});
    }
}
