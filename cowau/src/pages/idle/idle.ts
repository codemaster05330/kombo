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
        canvasIdleBackground();
    }

}

function canvasIdleBackground() {

    const ratio = 4;

    // Define a few important var/const for the following scripts
    const canvas : any  = document.getElementById('canvas');
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var ctx = canvas.getContext('2d',{
        antialias: false
    });

    // Create a canvas with the max size of the device
    // and make everything sharp as fuck
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    canvasWidth = canvasWidth * ratio;
    canvasHeight = canvasHeight * ratio;

    const x = canvasWidth/2;
    const y = canvasHeight/2;
    const objects = [];
    var radius = 50 * ratio;

    // Trigger of the Main Animaitonfunction to do stuff every Frame (60FPS)
    draw();

    // The Main Animationfunction to pulse the white ellipse
    function draw() {
        if(radius <= 3000) {
            radius += canvasWidth/25;
        } else {
            radius = 0;
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawCircle(ctx,x,y,radius);
        drawCircle(ctx,x,y,radius+500);
        drawCircle(ctx,x,y,radius+800);
        requestAnimationFrame(draw);

    }

    // Function to draw an ellipse in an html canvas element
    function drawCircle(ctx ,x, y, r) {
        let gradient = ctx.createRadialGradient(x,y,0,x,y,r);
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2, true);
        ctx.fill();
    }
}
