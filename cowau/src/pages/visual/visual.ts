import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GesturesService } from '../../services/gestures.service';

@Component({
  selector: 'page-visual',
  templateUrl: 'visual.html',
})

export class VisualPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, private gestureService:GesturesService) {
    	//gestureService.isFlipItGesture();
    }

    ionViewDidLoad() {
        initVisual();
    }

}

// ###############################################################
// ###############################################################
// Create the Visual Screen Canvas

function initVisual(){

    var cta = document.getElementById('canvas');
    cta.addEventListener('click',function(){
        setupVisualScreen();
    });

    // Define a few important var/const for the following scripts
    const cvs : any = document.getElementById('canvas');    // Define the Canvas Element
    const ctx = cvs.getContext('2d');                       // Setup the Canvas to 2D
    const ratio = window.devicePixelRatio                   // Define the DPI of the Screen

    // This are imporatent var for the Script,
    // but here you don't have to change something
    var canvasWidth = window.innerWidth;                    // Hight of the Canvas
    var canvasHeight = window.innerHeight;                  // Width of the Canvas
    var soundsArray = [];                                   // Array of all circles

    // Create a canvas with the max size of the device
    // and create a canvas with a higher DPI as the "Max-Size"
    // so everything is sharp as fuck
    cvs.width = canvasWidth * ratio;                        // Multiply the width, with the DPI Scale
    cvs.height = canvasHeight * ratio;                      // Multiply the width, with the DPI Scal
    cvs.style.width = canvasWidth + 'px';                   // Set the width in the canvas
    cvs.style.height = canvasHeight + 'px';                 // Set the hight in the canvas
    canvasWidth = canvasWidth * ratio;                      // Set the widdth of the canvas
    canvasHeight = canvasHeight * ratio;                    // Set the hight of the canvas

    // ###############################################################
    // ###############################################################

    // Function to create a new Soundobject
    function Sound(x, y, radius, mass){
        this.radius        = radius;
        this.x             = x;
        this.y             = y;
        this.mass          = mass;
        this.velocity      = {
            x: returnRandomValue(-20,20),
            y: returnRandomValue(-20,20)
        };

        this.updateSound = function() {
            this.borderDetectionSound();
            this.soundDetectionSound();
            this.moveSound();
            this.drawSound();
        }

        this.borderDetectionSound = function() {
            if(this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if(this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
        }

        this.moveSound = function() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

        this.drawSound = function() {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
            ctx.fill();
        }

        this.soundDetectionSound = function() {
            for (let i = 0; i < soundsArray.length; i++) {
                if(this === soundsArray[i]) continue;
                if(getDistance(this.x,soundsArray[i].x,this.y,soundsArray[i].y) - (this.radius * 2) < 0){
                    resolveCollision(this, soundsArray[i]);
                }
            }
        }
    }

    function setupVisualScreen() {
        let r = returnRandomValue(30,50)*ratio;
        let x = returnRandomValue(0+r,canvasWidth-r);
        let y = returnRandomValue(0+r,canvasHeight-r);
        let m = r;
        for(let j = 0; j < soundsArray.length; j++){
            if(getDistance(x,soundsArray[j].x, y, soundsArray[j].y) - (r*2) < 0 ){
                x = returnRandomValue(0+r,canvasWidth-r);
                y = returnRandomValue(0+r,canvasHeight-r);
                j = -1;
            }
        }
        var newSound = new Sound(x,y,r,m);
        soundsArray.push(newSound);
    }

    // Start the Canvas Animation
    draw();

    function draw() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        soundsArray.forEach(soundsArray => {
            soundsArray.updateSound();
        });
        requestAnimationFrame(draw);
    }

}


// ###############################################################
// ###############################################################
// Utility Functions

// Function to create a random int number
// with an min and max value
function returnRandomValue(min,max) {
    let random = Math.floor(Math.random() * (max-min + 1) + min );
    if(random === 0){
        return random = min;
    } else {
        return random;
    }
}

// Function to detect distance between to objects
function getDistance(x1, x2, y1, y2) {
    let xDistance = x2-x1;
    let yDistance = y2-y1;
    return Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
