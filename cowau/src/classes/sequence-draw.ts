// SequenceDraw Class
//
// This class is used to create, move
// and disappear Sound Sequence Objects.
// ############################################################################
// ############################################################################

import {SoundWave} from './sound-wave';


export class SequenceDraw {

    radius:number;                              // radius of the sequence
    newRadius:number;                           // radius with lifetime value
    emoji:number;                               // emoji id of this sequence
    x:number;                                   // y position of the sequence
    y:number;                                   // x positon of the sequence
    mass:number;                                // Mass of the sequence
    tones:number;                               // Count the Tones in the sequence
    lifeTimeValue:number;                       // The lifetime of the object 100-0
    soundWaves:Array<SoundWave> = [];           // The Soundwaves from this object
    emojiImg:any;                               // Create new object
    velocity:any;                               // The velocity of each object
    ctx:any;                                    // Canvas Object
    soundsArray:any;                            // Sound Array Objects
    canvasWidth:number;                         // Width of the Canvas Object
    canvasHeight:number;                        // Hight of the Canvas Object
    ratio:number;                               // Value of the Screen Ratio

	constructor(radius:number,
                x:number,
                y:number,
                mass:number,
                tones:number,
                emoji:number,
                ctx:any,
                soundsArray:any,
                canvasWidth:any,
                canvasHeight:any,
                ratio:number){
        this.radius         = radius;                        // radius of the sequence
        this.newRadius;                                      // radius with lifetime value
        this.emoji          = emoji                          // emoji id of this sequence
        this.x              = x;                             // y position of the sequence
        this.y              = y;                             // x positon of the sequence
        this.mass           = mass;                          // Mass of the sequence
        this.tones          = tones;                         // Count the Tones in the sequence
        this.lifeTimeValue  = 100;                           // The lifetime of the object 100-0
        this.soundWaves     = [];                            // The Soundwaves from this object
        this.emojiImg       = new Image();                   // Create new object
        this.ratio          = ratio;
        this.velocity       = {
            x: this.returnRandomValue(-1,1),                 // velocity in the x direction
            y: this.returnRandomValue(-1,1)                  // velocity in the y direction
        };
        this.ctx            = ctx;                           // Canvas Object
        this.soundsArray    = soundsArray;                    // Sound Array Objects
        this.canvasWidth    = canvasWidth;                   // Width of the Canvas Object
        this.canvasHeight   = canvasHeight;                  // Hight of the Canvas Object

        // Emoji
        this.emojiImg.src   = '../../assets/imgs/' + this.emoji + '.svg';
	}

    // Function to update the sequence element
    // this function is used for Collision ditection,
    // movement and the drawing of the element
    public updateSound() : void {
        // Update the this.radius var to the new value
        this.newRadius = this.radius * (this.lifeTimeValue/100);

        this.soundWaves.forEach((soundwave:SoundWave) => {
            soundwave.updateSoundWave();
        })

        this.borderDetectionSound();                    // Controll if the object hits the wall
        this.moveSound();                               // move the object random
        this.drawSound();                               // draw the sequence object
        this.lifeTime();                                // reduce lifetime
        this.soundDetectionSound();                     // Controll if the object hits another object
    }

    // Function to detect if the sound object hits an wall of the canvas
    // When the detects gets true, the velocity get negating
    public borderDetectionSound() : void {
        if(this.x + this.newRadius > this.canvasWidth || this.x - this.newRadius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.newRadius > this.canvasHeight || this.y - this.newRadius < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }

    // TODO: Change this to a real LifeTime calculation.
    // Calculates the lifetime for the sequence object.
    public lifeTime() {
        if((this.lifeTimeValue/100) > 0.01) {
            this.lifeTimeValue = this.lifeTimeValue - 0.05;
        } else {
            this.soundsArray.splice(this.soundsArray.indexOf(this),1);
        }
    }

    // Function to move the sequence object in an
    // random direction
    public moveSound() : void {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // Function to draw the sequence object into the canvas
    public drawSound() : void {
        this.ctx.globalAlpha = (this.lifeTimeValue/100);
        this.ctx.fillStyle = '#353847';
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.newRadius,0,Math.PI*2,true);
        this.ctx.fill();
        this.ctx.drawImage(this.emojiImg,this.x-(this.newRadius*0.7),this.y-(this.newRadius*0.7),(this.newRadius*2)*0.7,(this.newRadius*2)*0.7);
    }

    // Functiton to detect if the sequence hits another sound object.
    // When this happend, this function starts the resloveCollision function.
    // Here this sequence object and the sequence object that gets hit will get new
    // positions, with new velocity and mass.
    public soundDetectionSound() : void {
        for (let i = 0; i < this.soundsArray.length; i++) {
            if(this === this.soundsArray[i]) continue;
            if(this.getDistance(this.x,this.soundsArray[i].x,this.y,this.soundsArray[i].y, this.newRadius, this.soundsArray[i].newRadius) < 0){
                this.resolveCollision(this, this.soundsArray[i]);
            }
        }
    }

    // Function to create Soundwaves of this Sequence Object.
    public createSoundWave() : void {
        let soundWave = new SoundWave(this.soundWaves,this.newRadius,this.x,this.y,(this.lifeTimeValue/100),this.ctx,this.canvasWidth,this.canvasHeight,this.ratio);
        this.soundWaves.push(soundWave);
    }

    // ###############################################################
    // ###############################################################
    // Utility Functions

    // Function to create a random int number
    // with an min and max value
    public returnRandomValue(min,max) {
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

    // Is a function that changes the direction
    // vector for the objects according to the sizes.
    public rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
        return rotatedVelocities;
    }


    // Calculates the physical changes in a collision between two objects.
    // This requires mass, acceleration and direction.
    public resolveCollision(particle, otherParticle) {
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
            const u1 = this.rotate(particle.velocity, angle);
            const u2 = this.rotate(otherParticle.velocity, angle);
            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
            // Final velocity after rotating axis back to original location
            const vFinal1 = this.rotate(v1, -angle);
            const vFinal2 = this.rotate(v2, -angle);
            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;
            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }
}
