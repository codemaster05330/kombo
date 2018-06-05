import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SequenceDraw } from '../../classes/sequence-draw';
import { AudioBufferLoader } from 'waves-loaders';
import * as audio from 'waves-audio';
import { MetricSync } from '../../services/metric-sync.service';
import { Socket } from 'ng-socket-io';
import { Sequence, SoundType } from '../../classes/sequence';
import { Observable } from 'rxjs/Observable';
import * as soundsData from '../../assets/sounds/sounds.json';
import { ServerConnectionService } from '../../services/server-connection.service';

const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
  selector: 'page-visual',
  templateUrl: 'visual.html',
})

export class VisualPage {

    cvs : any;                                                                  // Define the Canvas Element
    ctx : any;                                                                  // Setup the Canvas to 2D
    ratio : number          = window.devicePixelRatio                           // Define the DPI of the Screen
    fps : number            = 60;                                               // FPS of the Canvas
    canvasWidth : number    = window.innerWidth;                                // Hight of the Canvas
    canvasHeight : number   = window.innerHeight;                               // Width of the Canvas
    sequenceArray:Array<SequenceDraw>  = [];                                    // Array of all circles

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private metricSync:MetricSync,
        private socket:Socket,
        private serverCon:ServerConnectionService) {}

    ionViewDidLoad() {

        this.initMetrics();
        this.observeServer().subscribe(data => {});

        // Create a new sound element just for testing
        // this part of the code can be removed in the final version
        this.cvs = document.getElementById('canvas');
        this.ctx = this.cvs.getContext('2d');

        // Create a canvas with the max size of the device
        // and create a canvas with a higher DPI as the "Max-Size"
        // so everything is sharp as fuck
        this.cvs.width = this.canvasWidth * this.ratio;                         // Multiply the width, with the DPI Scale
        this.cvs.height = this.canvasHeight * this.ratio;                       // Multiply the width, with the DPI Scal
        this.cvs.style.width = this.canvasWidth + 'px';                         // Set the width in the canvas
        this.cvs.style.height = this.canvasHeight + 'px';                       // Set the hight in the canvas
        this.canvasWidth = this.canvasWidth * this.ratio;                       // Set the widdth of the canvas
        this.canvasHeight = this.canvasHeight * this.ratio;                     // Set the hight of the canvas

        // Start the Canvas Animation
        this.draw();

    }

    observeServer() {
        let observable = new Observable(observer => {
            this.socket.on('new-sequence', (data)=> {

                console.log('New Sequence');

                let m = 0;                                                      // Mass of the Sequence Object

                // Method to define the Size/Mass of the Sequence Objects
                // Count every tone in the BeatGrid
                data.beatGrid.forEach(beatrow => {
                    beatrow.forEach(beat => {
                        m += beat;
                    });
                });

                let x = this.canvasWidth/2;                                     // xPos
                let y = this.canvasHeight/2;                                    // yPos
                let c = 0;                                                      // Count Value
                let r = m*this.ratio*1.5;                                       // Size of the Sequence Object

                for(let j = 0; j < this.sequenceArray.length; j++){
                    if(c >= 20) {break;}
                    c++;
                    if(this.getDistance(x,this.sequenceArray[j].x, y, this.sequenceArray[j].y, r, this.sequenceArray[j].radius) < 0 ){
                        x = this.returnRandomValue(0+r,this.canvasWidth-r);
                        y = this.returnRandomValue(0+r,this.canvasHeight-r);
                        j = -1;
                    }
                }

                var newSound = new SequenceDraw(r,x,y,m,data.id,this.ctx,this.sequenceArray,this.canvasWidth,this.canvasHeight,this.ratio,data.beatGrid,data.type);
                this.sequenceArray.push(newSound);

            });
        });
        return observable;
    }

    initMetrics() {
        const socket = this.socket;
        const sendFunction = (cmd, ...args) => socket.emit(cmd, ...args);
        const receiveFunction = (cmd, args) => socket.on(cmd, args);
        const loader = new AudioBufferLoader();
        var soundsArrayString = [];

        soundsData[0].forEach(soundsData => {
			soundsArrayString = soundsArrayString.concat(soundsData.pitches);   // New "big" Sound Array
		});

        loader.load(soundsArrayString)                                          // Load every Sound
        .then((buffers) => {                                                    // Start the MetricSync after everything is loaded
            this.metricSync.start(sendFunction, receiveFunction).then(() => {
                this.metricSync.addMetronome((measure, beat) => {
					console.log('metro:', measure, beat);
                    this.sequenceArray.forEach(soundArray => {
                        for(let i: number = 0; i < soundArray.retrunBeatGrid().length; i++){
    						if(soundArray.retrunBeatGrid()[i][(measure % 4) * 8 + beat] > 0){
                                soundArray.createSoundWave();
    							this.playSound(soundArray.returnSoundArt(), 4 - i, soundArray.retrunBeatGrid()[i][(measure % 4) * 8 + beat], buffers, soundArray.returnLifeTime());
    						}
    					}
                    });
                }, 8, 8);
            });
        }).catch(function(err) {
            console.log("loader error:", err.message);
        });
    }

    // Function that plays specific sounds when needed.
    playSound(type:SoundType,pitch:number,length:number,buffers,amp:number) {
        // Get Time from Server
        const time = audioScheduler.currentTime;                                // Sync Time
        const src = audioContext.createBufferSource();                          // Create Source
        const gain = audioContext.createGain();
        gain.value = amp;
        // Play Audio File
        gain.connect(audioContext.destination);                                  // Connect Autio Context
        src.connect(gain);
        src.buffer = buffers[((type)*5)+pitch];                                 // Define witch sound the fucktion is playing
        src.start(time);                                                        // Start Sound
    }

    // Function to update the Animation, this will draw a new Frame every 60 seconds
    draw() : void {
        this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.sequenceArray.forEach(sequenceArray => {
            sequenceArray.updateSound();
        });
        requestAnimationFrame(() => {this.draw()});
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

    // Function to detect distance between to objects
    public getDistance(x1, x2, y1, y2, r1, r2) {
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2) ) - (r2 + r1);
    }
}
