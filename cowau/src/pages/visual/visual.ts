import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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


    // Create a new sound element just for testing
    // this part of the code can be removed in the final version
    var cta = document.getElementById('canvas');
    cta.addEventListener('click',function(){
        setupVisualScreen();
    });

    // Define a few important var/const for the following scripts
    const cvs : any = document.getElementById('canvas');    // Define the Canvas Element
    const ctx = cvs.getContext('2d');                       // Setup the Canvas to 2D
    const ratio = window.devicePixelRatio                   // Define the DPI of the Screen
    const fps = 60;                                          // FPS of the Canvas

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

    // Function to create a new Soundobject with mass, x, y and radius
    function Sound(x, y, radius, mass, tones){
        this.radius        = radius;                      // radius of the sound
        this.x             = x;                           // y position of the sound
        this.y             = y;                           // x positon of the sound
        this.mass          = mass;                        // Mass of the sound
        this.tones         = tones;                       // Count the Tones in the sound
        this.lifeTimeValue = 100;                         // The lifetime of the object 100-0
        this.soundWaves    = [];                          // The Soundwaves from this object
        this.velocity      = {
            x: returnRandomValue(-5,5),                   // velocity in the x direction
            y: returnRandomValue(-5,5)                    // velocity in the y direction
        };

        // Function to update the sound element
        // this function is used for Collision ditection,
        // movement and the drawing of the element
        this.updateSound = function() {
            for(var i = 0; i < this.soundWaves.length;i++) {
                var newSoundWave = this.soundWaves[i];
                newSoundWave.update();
            }

            var test = returnRandomValue(0, 30);

            if(test == 2){
                this.createSoundWave();
            }

            this.borderDetectionSound();                    // Controll if the object hits the wall
            this.moveSound();                               // move the object random
            this.drawSound();                               // draw the sound object
            this.lifeTime();                                // reduce lifetime
            this.soundDetectionSound();                     // Controll if the object hits another object
        }

        this.createSoundWave = function() {
            var soundWave = new Circle(this.soundWaves,this.radius,this.x,this.y,2);
            this.soundWaves.push(soundWave);
        }

        this.lifeTime = function() {
            if((this.lifeTimeValue/100) > 0.03) {
                this.lifeTimeValue = this.lifeTimeValue - (this.lifeTimeValue/100);
                // console.log('alive');
            } else {
                // console.log('die');
                soundsArray.splice(soundsArray.indexOf(this),1);
            }
    }

        // Function to detect if the sound object hits an wall of the canvas
        // When the detects gets true, the velocity get negating
        this.borderDetectionSound = function() {
            if(this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if(this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
        }

        // Function to move the sound object in an
        // random direction
        this.moveSound = function() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }

        // Function to draw the Sound object into the canvas
        this.drawSound = function() {

            ctx.globalAlpha = (this.lifeTimeValue/100);
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
            ctx.fill();
        }

        // Functiton to detect if the sound hits another sound object.
        // When this happend, this function starts the resloveCollision function.
        // Here this Sound object and the sound object that gets hit will get new
        // positions, with new velocity and mass.
        this.soundDetectionSound = function() {
            for (let i = 0; i < soundsArray.length; i++) {
                if(this === soundsArray[i]) continue;
                if(getDistance(this.x,soundsArray[i].x,this.y,soundsArray[i].y, this.radius, soundsArray[i].radius) < 0){
                    resolveCollision(this, soundsArray[i]);
                }
            }
        }
    }


    // Function to draw Circles into the Canvas
    function Circle(soundWave,radius,xPos,yPos,speed) {
        this.radius = radius;       // Radius of this object
        this.xPos = xPos;           // x position of this object
        this.yPos = yPos;           // y position of this object
        this.speed = speed;         // Movementspeed of the Soundwave
        this.opacity = 1;           // Opacity of the soundwave

        // Update the radius of the circle every frame,
        // indipendent from other Circles
        this.update = function(){
            this.radius += (this.speed*ratio); // Update the radus of this Circle
            this.opacity += -0.008;
            if(this.opacity < 0 ) {
                this.opacity = 0;
            } else {
                this.opacity += -0.008;
            }
            let gradient = ctx.createRadialGradient(this.xPos,this.yPos,0,this.xPos,this.yPos,this.radius);
            gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.xPos,this.yPos,this.radius,0,Math.PI*2,true);
            ctx.fill();

            if(this.radius >= canvasWidth/2 && this.radius >= canvasHeight/2) {
                soundWave.splice(soundWave.indexOf(this),1); // Delete old Circlces
            }
        }
    }

    // function to setup the Visual Screen and draw soundobjects into the canvas
    function setupVisualScreen() {
        let r = returnRandomValue(20,200);
        let x = returnRandomValue(0+r,canvasWidth-r);
        let y = returnRandomValue(0+r,canvasHeight-r);
        let t = returnRandomValue(0,256);
        let m = 20;
        let c = 0;

        for(let j = 0; j < soundsArray.length; j++){
            if(c >= 20) {break;}
            c++;
            if(getDistance(x,soundsArray[j].x, y, soundsArray[j].y, r, soundsArray[j].radius) < 0 ){
                x = returnRandomValue(0+r,canvasWidth-r);
                y = returnRandomValue(0+r,canvasHeight-r);
                j = -1;
            }
        }
        var newSound = new Sound(x,y,r,m,t);
        soundsArray.push(newSound);
    }

    // Start the Canvas Animation
    draw();
    function draw() {
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        soundsArray.forEach(soundsArray => {
            soundsArray.updateSound();
        });
        setTimeout(function() {
            requestAnimationFrame(draw);
        }, 1000 / fps);
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
function getDistance(x1, x2, y1, y2, r1, r2) {
    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2) ) - (r2 + r1);
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
