import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-idle',
  templateUrl: 'idle.html',
})

export class IdlePage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    ionViewDidLoad() {
        initCircle();
    }

}

function initCircle(){
    // ###############################################################
    // Circle Animation Function
    // This function creates the Background Animation

    // Define a few important var/const for the following scripts
    const cvs : any = document.getElementById('canvas');    // Define the Canvas Element
    const ctx = cvs.getContext('2d');                       // Setup the Canvas to 2D
    const speed = 20;                                        // Define the Speed of the animaiton
    const ratio = 2;                                        // Define the DPI of the Screen


    // This are imporatent var for the Script,
    // but here you don't have to change something
    var canvasWidth = window.innerWidth;                    // Hight of the Canvas
    var canvasHeight = window.innerHeight;                  // Width of the Canvas
    var circles = [];                                       // Array of all circles

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
    // Test Trigger of the Circle animaiton

    var cta = document.getElementById('call-to-action');
    cta.addEventListener('click',function(){
        setupCircles(10,canvasWidth/2,canvasHeight/2)
    });

    setupCircles(10,canvasWidth/2,canvasHeight/2);

    // ###############################################################
    // ###############################################################

    // Function to draw Circles into the Canvas
    function Circle(radius,xPos,yPos) {
        this.radius = radius;       // Radius of this object
        this.xPos = xPos;           // x position of this object
        this.yPos = yPos;           // y position of this object

        // Update the radius of the circle every frame,
        // indipendent from other Circles
        this.update = function(){
            this.radius += (speed*ratio); // Update the radus of this Circle
            console.log(this + ': ' + this.radius);
            let gradient = ctx.createRadialGradient(this.xPos,this.yPos,0,this.xPos,this.yPos,this.radius);
            gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.xPos,this.yPos,this.radius,0,Math.PI*2,true);
            ctx.fill();
            if(this.radius >= canvasWidth && this.radius >= canvasHeight) {
                circles.splice(circles.indexOf(this),1); // Delete old Circlces
            }
        }
    }

    // Function to create new Circles
    function setupCircles(r,x,y) {
        var circle = new Circle(r,x,y);     // Create new Circle Object
        circles.push(circle);               // Add Circle Object to the array
    }

    // Start the Canvas Animation
    drawAndUpdate();

    // Function that get triggert 60 times every second
    // so this function creaetes the animation in the background
    function drawAndUpdate() {
        // This line clear the canvas every Frame,
        // without this line, every circles would stay
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        for(var i = 0; i < circles.length;i++) {
            var newCircle = circles[i];
            newCircle.update();
        }
        // this line request this function every frame
        requestAnimationFrame(drawAndUpdate);
    }
}
