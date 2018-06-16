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
    ctx:any;                                                                    // Canvas Object
    canvasWidth:number;                                                         // Width of the Canvas Object
    canvasHeight:number;                                                        // Hight of the Canvas Object
    ratio:number;                                                               // Value of the px ratio of the used screen

    constructor(radius:number,
                speed:number,
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
        this.speed = (32/speed);
        this.opacity = opacity;
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ratio = ratio;
    }

    // Update the radius of the circle every frame,
    // indipendent from other circles
    public updateSoundWave() {
		if(this.radius >= this.radius*10) {
			this.radius = this.radius*10;										// Performance Upgrade
		} else {
			this.radius += (this.speed*this.ratio);                             // Update the radius of this circle
		}
        this.opacity += -0.01;                                                  // Percentage subtracted with each frame
        if(this.opacity < 0) {this.opacity = 0;}                                // Fallback to prevent a Error if the Value is negativ
        this.drawSoundWave();
    }

    public returnSoundWave() {
        return this.opacity;
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
