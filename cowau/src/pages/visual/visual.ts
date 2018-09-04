import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//services
import { MetricSync } from '../../services/metric-sync.service';
// import { ServerConnectionService } from '../../services/server-connection.service';

//classes
import { SoundType } from '../../classes/sequence';
import { SequenceDraw } from '../../classes/sequence-draw';
import { Variables } from '../../classes/variables';

// Server
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

// Audio Files & Stuff
// import { AudioBufferLoader } from 'waves-loaders';
import * as audio from 'waves-audio';
// import * as soundsData from '../../assets/sounds/sounds.json';

const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
  selector: 'page-visual',
  templateUrl: 'visual.html',
})

export class VisualPage {

	callback: any;																//
    cvs : any;                                                                  // Define the Canvas Element
    ctx : any;                                                                  // Setup the Canvas to 2D
    ratio : number          = window.devicePixelRatio                           // Define the DPI of the Screen
    canvasWidth : number    = window.innerWidth;                                // Hight of the Canvas
    canvasHeight : number   = window.innerHeight;                               // Width of the Canvas
    sequenceArray:Array<SequenceDraw>  = [];                                    // Array of all circles
    soundLengths : number[];
    fps: number = 60;
    fpsInterval: number = 1000 / this.fps;
    calc: any = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private metricSync:MetricSync,
        private socket:Socket,
        private globalVars: Variables) {}

    ionViewDidLoad() {

		// Connect Metric Sync service and
		// observe the server if something happend
        this.runMetronome();
        this.observeServer().subscribe(data => {});

        // Create a new sound element just for testing
        // this part of the code can be removed in the final version
        this.cvs = document.getElementById('canvas');
        this.ctx = this.cvs.getContext('2d');
		this.soundLengths = this.globalVars.soundLengths;

        // Create a canvas with the max size of the device
        // and create a canvas with a higher DPI as the "Max-Size"
        // so everything is sharp as fuck
        this.cvs.width = this.canvasWidth * this.ratio;                         // Multiply the width, with the DPI Scale
        this.cvs.height = this.canvasHeight * this.ratio;                       // Multiply the width, with the DPI Scal
        this.cvs.style.width = this.canvasWidth + 'px';                         // Set the width in the canvas
        this.cvs.style.height = this.canvasHeight + 'px';                       // Set the hight in the canvas
        this.canvasWidth = this.canvasWidth * this.ratio;                       // Set the widdth of the canvas
        this.canvasHeight = this.canvasHeight * this.ratio;                     // Set the hight of the canvas

        // Start the Canvas Animation & set values for this animation
        this.draw();                            // Start the Animation function
    }

    observeServer() {
        let observable = new Observable(observer => {
            this.socket.on('new-sequence', (data)=> {
                let m = 0;                                                      // Mass of the Sequence Object

                // Method to define the Size/Mass of the Sequence Objects
                // Count every tone in the BeatGrid
                data.beatGrid.forEach(beatrow => {
                    beatrow.forEach(beat => {
                        m += beat;
                    });
                });

				if(m <= 0) {
					console.log('Error: Zu wenig Sounds vorhanden.')
				} else {
					let x = this.canvasWidth/2;                                     // xPos
					let y = this.canvasHeight/2;                                    // yPos
					let c = 0;                                                      // Count Value
					let r = m*this.ratio*1.5;                                       // Size of the Sequence Object
                    if(r < 100) { r = 75; }
					for(let j = 0; j < this.sequenceArray.length; j++){
						if(c >= 20) { break; }
						c++;
						if(this.getDistance(x,this.sequenceArray[j].x, y, this.sequenceArray[j].y, r, this.sequenceArray[j].radius) < 0 ){
							x = this.returnRandomValue(0+r,this.canvasWidth-r);
							y = this.returnRandomValue(0+r,this.canvasHeight-r);
							j = -1;
						}
					}
					var newSound = new SequenceDraw(r,x,y,m,data.id,this.ctx,this.sequenceArray,this.canvasWidth,this.canvasHeight,this.ratio,data.beatGrid,data.type);
					this.sequenceArray.push(newSound);
				}
            });
        });
        return observable;
    }

	runMetronome() {
		this.callback = (measure, beat) => {
			this.sequenceArray.forEach(soundArray => {
			var statuswave = true;
				for(let i: number = 0; i < soundArray.retrunBeatGrid().length; i++){
					if(soundArray.retrunBeatGrid()[i][(measure % 2) * 8 + beat] > 0){
						this.playSound(soundArray.returnSoundArt(), 4 - i, soundArray.retrunBeatGrid()[i][(measure % 4) * 8 + beat], soundArray.returnLifeTime());
						if(statuswave) {
							soundArray.createSoundWave();
							statuswave = false;
						}
					}
				}
			});
		};
		this.metricSync.addMetronome(this.callback, 8, 8, 2);
	}

    // Function that plays specific sounds when needed.
    playSound(type:SoundType,pitch:number,length:number,amp:number) {
        // Get Time from Server
        const time = audioScheduler.currentTime;                                // Sync Time
        const src = audioContext.createBufferSource();                          // Create Source
        const gainC = audioContext.createGain();
        const gainValue = this.decibelToLinear(this.globalVars.soundGains[type]) * amp;
        gainC.gain.value = gainValue;

        // Play Audio File
        gainC.connect(audioContext.destination);                                         // Connect Autio Context
        src.connect(gainC);
        src.buffer = this.globalVars.buffers[type];                                     // Define witch sound the fucktion is playing
        src.start(time, pitch * 3, Math.min(length, this.soundLengths[type]) * 0.25);   // Start Sound
        const endTime = time + Math.min(length, this.soundLengths[type]) * 0.25;
        gainC.gain.setValueAtTime(gainValue,endTime -0.05);
        gainC.gain.linearRampToValueAtTime(0, endTime);
    }

    decibelToLinear(value: number){
        return Math.pow(10, value/20);
    }

    // Function to update the Animation, this will draw a new Frame every 60 seconds
    draw() {
        setTimeout( () => {
            // Request new Animation Frame to draw funny stuff
            requestAnimationFrame(() => {this.draw()});

            // DEBUG: Here you can enable a frame counter.
            // this.calc++;
            // console.log('Frame: ' + this.calc);
            // console.log('______________________________________');
            // if(this.calc === this.fps){ this.calc = 0; }

            // Here is the code you like to run when a frame is drawn
            this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            this.sequenceArray.forEach(sequenceArray => {
                sequenceArray.updateSound();
            });

        }, this.fpsInterval);
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
