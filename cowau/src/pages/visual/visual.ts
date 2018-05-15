import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SequenceDraw } from '../../classes/sequence-draw';
import * as wavesAudio from 'waves-audio';
import * as wavesLoaders from 'waves-loaders';

@Component({
  selector: 'page-visual',
  templateUrl: 'visual.html',
})

export class VisualPage {

    cvs : any;                                                      // Define the Canvas Element
    ctx : any;                                                      // Setup the Canvas to 2D
    ratio : number          = window.devicePixelRatio               // Define the DPI of the Screen
    fps : number            = 60;                                   // FPS of the Canvas
    canvasWidth : number    = window.innerWidth;                    // Hight of the Canvas
    canvasHeight : number   = window.innerHeight;                   // Width of the Canvas
    soundsArray:Array<SequenceDraw>  = [];                          // Array of all circles

    constructor( public navCtrl: NavController, public navParams: NavParams) {}

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

        // TODO: Create two sequence objects to test everything.
        // Create a click event to test the canvas
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
