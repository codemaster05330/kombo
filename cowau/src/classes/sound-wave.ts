// SoundWave Class
//
// This class is used to create, move
// and disappear sound waves when called.
// ############################################################################
// ############################################################################

export class SoundWave {

    radius:number;                                                              // Radius of the Soundwave
    xPos:number;                                                                // X-Position
    yPos:number;                                                                // Y-Position
    speed:number;                                                               // Movementspeed of the Soundwave
    opacity:number;                                                             // Opacity of the Soundwave
    soundWave:any;                                                              // Array of all Soundwaves
    ctx:any;                                                                    // Canvas Object
    canvasWidth:number;                                                         // Width of the Canvas Object
    canvasHeight:number;                                                        // Hight of the Canvas Object
    ratio:number;                                                               // Value of the px ratio of the used screen

    constructor(soundWave:any,
                radius:number,
                xPos:number,
                yPos:number,
                opacity:number,
                ctx:any,
                canvasWidth:number,
                canvasHeight:number,
                ratio:number) {
        this.radius = radius;
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = 6;
        this.opacity = opacity;
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ratio = ratio;
    }

    // Update the radius of the circle every frame,
    // indipendent from other circles
    public updateSoundWave() {
        this.radius += (this.speed * this.ratio);                               // Update the radius of this circle
        this.opacity += -0.01;                                                  // Percentage subtracted with each frame
        if(this.opacity < 0) {this.opacity = 0;}                                // Fallback to prevent a Error if the Value is negativ
        this.drawSoundWave();
        this.killSoundWave();
    }

    public killSoundWave() {
        // Function to delete old circles if they are out of view
        if(this.radius >= this.canvasWidth/2 && this.radius >= this.canvasHeight/2) {
            // this.soundWave.slice(this.soundWave.indexOf(this.soundWave),1);
        }
    }

    public drawSoundWave() {
        let gradient = this.ctx.createRadialGradient(this.xPos,this.yPos,0,this.xPos,this.yPos,this.radius);
        gradient.addColorStop(0.8, 'rgba(255,255,255,0)');
        gradient.addColorStop(1,'rgba(255,255,255,0.2)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.arc(this.xPos,this.yPos,this.radius,0,Math.PI*2,true);
        this.ctx.fill();
    }

}
