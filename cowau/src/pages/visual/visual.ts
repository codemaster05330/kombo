import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as wavesAudio from 'waves-audio';
import * as wavesLoaders from 'waves-loaders';
import {SequenceDraw} from '../../classes/sequence-draw';

@Component({
  selector: 'page-visual',
  templateUrl: 'visual.html',
})

export class VisualPage {

    // ##########################################################################
    // ##########################################################################
    // ##########################################################################
    // Test for Audio PlayCrontrol & Audio Playback
    audioContext : any      = wavesAudio.audioContext;
    loader : any            = new wavesLoaders.SuperLoader();
    // ##########################################################################
    // ##########################################################################
    // ##########################################################################

    cvs : any;                                                      // Define the Canvas Element
    ctx : any;                                                      // Setup the Canvas to 2D
    ratio : number          = window.devicePixelRatio               // Define the DPI of the Screen
    fps : number            = 60;                                   // FPS of the Canvas
    canvasWidth : number    = window.innerWidth;                    // Hight of the Canvas
    canvasHeight : number   = window.innerHeight;                   // Width of the Canvas
    soundsArray:Array<SequenceDraw>  = [];                          // Array of all circles

    constructor( public navCtrl: NavController, public navParams: NavParams) {}

    playSound(soundUrl) {
        // load audio and marker files
        this.loader.load(soundUrl).then(function(loaded) {
            var audioBuffer = loaded[0];
            var markerBuffer = loaded[1];
            var beatDuration = audioBuffer.duration / 4;

            // create player engine
            var playerEngine = new wavesAudio.PlayerEngine();
            playerEngine.buffer = audioBuffer;
            playerEngine.cyclic = true;
            playerEngine.connect(this.audioContext.destination);

            // create play control
            var playControl = new wavesAudio.PlayControl(playerEngine);
            playControl.setLoopBoundaries(0, 2 * audioBuffer.duration);
            // playControl.loop = true;
            playControl.start();
            setTimeout(function(){
                playControl.stop();
            }, 200);

        });
    }

    ionViewDidLoad() {

        // Create a new sound element just for testing
        // this part of the code can be removed in the final version
        var cta = document.getElementById('canvas');
        this.cvs = document.getElementById('canvas');
        this.ctx = this.cvs.getContext('2d');

        // Create a canvas with the max size of the device
        // and create a canvas with a higher DPI as the "Max-Size"
        // so everything is sharp as fuck
        this.cvs.width = this.canvasWidth * this.ratio;          // Multiply the width, with the DPI Scale
        this.cvs.height = this.canvasHeight * this.ratio;        // Multiply the width, with the DPI Scal
        this.cvs.style.width = this.canvasWidth + 'px';          // Set the width in the canvas
        this.cvs.style.height = this.canvasHeight + 'px';        // Set the hight in the canvas
        this.canvasWidth = this.canvasWidth * this.ratio;        // Set the widdth of the canvas
        this.canvasHeight = this.canvasHeight * this.ratio;      // Set the hight of the canvas

        // Create a click event to test the canvas
        this.createSequenceObject();
        this.createSequenceObject();
        this.createSequenceObject();
        this.createSequenceObject();
        this.createSequenceObject();
        this.createSequenceObject();
        this.createSequenceObject();

        // Start the Canvas Animation
        this.draw();

    }

    // Function to update the Animation, this will draw a new Frame every 60 seconds
    draw() : void {
        this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        this.soundsArray.forEach(soundArray => {
            soundArray.updateSound();
        });
        requestAnimationFrame(() => {this.draw()});
    }

    // TODO: Change this Funtion from random generated values to real values form a Sequence Object
    // This function creraete a new, random Sequence Element
    createSequenceObject() : void {
        let r = this.returnRandomValue(20,200);
        let x = this.returnRandomValue(0+r,this.canvasWidth-r);
        let y = this.returnRandomValue(0+r,this.canvasHeight-r);
        let t = this.returnRandomValue(0,256);
        let m = 250;
        let c = 0;

        for(let j = 0; j < this.soundsArray.length; j++){
            if(c >= 20) {break;}
            c++;
            if(this.getDistance(x,this.soundsArray[j].x, y, this.soundsArray[j].y, r, this.soundsArray[j].radius) < 0 ){
                x = this.returnRandomValue(0+r,this.canvasWidth-r);
                y = this.returnRandomValue(0+r,this.canvasHeight-r);
                j = -1;
            }
        }

        var newSound = new SequenceDraw(r,x,y,m,t,this.returnRandomValue(0,11),this.ctx,this.soundsArray,this.canvasWidth,this.canvasHeight,this.ratio);
        this.soundsArray.push(newSound);
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

    //         // just for Testing
    //         var test = this.returnRandomValue(0, 30);
    //         if(test == 2){
    //             this.createSoundWave();
    //         }
    //
    //         // Function to fire the update function from every Soundwave created
    //         // by this sequence object
    //         for(var i = 0; i < this.soundWaves.length;i++) {
    //             var newSoundWave = this.soundWaves[i];
    //             newSoundWave.update();
    //         }
    //     this.createSoundWave = function() {
    //         var soundWave = new Soundwave(this.soundWaves,this.newRadius,this.x,this.y,2);
    //         this.soundWaves.push(soundWave);
    //     }
