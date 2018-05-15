import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { ClientMetricSync } from '../../services/metric-sync.service';

import { Socket } from 'ng-socket-io';

import { GesturesService } from '../../services/gestures.service';

//pages
import { EmojiPage } from '../emoji/emoji';

//classes
import { GestureType } from '../../classes/gesture-type';
import { audioContext } from 'waves-audio';
import { AudioBufferLoader } from 'waves-loaders';

import * as audio from 'waves-audio';
const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
  selector: 'page-idle',
  templateUrl: 'idle.html',
})

export class IdlePage {
	lookOfEvents:Array<GestureType> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, private platform:Platform, private events:Events, private socket:Socket,
    			private metricSync:ClientMetricSync, private gesturesService:GesturesService) {
    	platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				this.gesturesService.watchForGesture(this.lookOfEvents);
			}
		});


		// events.subscribe(GestureType.IDLE_OUT.toString(), (acceleration) => {
		// 	setTimeout(() => {
		// 		this.navCtrl.setRoot(EmojiPage);
		// 		this.gesturesService.stopGestureWatch(this.events, [GestureType.IDLE_OUT]);
		// 	}, 500);
		// });
    }

    ionViewDidLoad() {
        initCircle();

        this.initServerConnection().then(() => {
            this.initMetrics();
        });
    }

    initServerConnection() {
        const socket = this.socket;

    	socket.connect();
    	socket.emit('request');

        const promise = new Promise((resolve, reject) => {
            socket.on('acknowledge', (data) => {
                console.log('Connected to server!');
                resolve();
            });            
        });

        return promise;
    }

    initMetrics() {
        const socket = this.socket;
        const sendFunction = (cmd, ...args) => socket.emit(cmd, ...args);
        const receiveFunction = (cmd, ...args) => socket.on(cmd, ...args);

        const loader = new AudioBufferLoader();

        loader.load(['assets/sounds/909-HH-closed.wav', 'assets/sounds/909-HH-open.wav'])
        .then((buffers) => {
            this.metricSync.start(sendFunction, receiveFunction).then(() => {
                this.metricSync.addMetronome((measure, beat) => {
                    const time = audioScheduler.currentTime;
                    const src = audioContext.createBufferSource();
                    src.connect(audioContext.destination);
                    src.buffer = (beat !== 7) ? buffers[0] : buffers[1];
                    src.start(time);
                    console.log('metro:', measure, beat);
                }, 8, 8);
            });
        }).catch(function(err) {
            console.log("loader error:", err.message);
        });
    }
}

function initCircle(){
    // ###############################################################
    // Circle Animation Function
    // This function creates the Background Animation

    // Define a few important var/const for the following scripts
    const cvs : any = document.getElementById('canvas');    // Define the Canvas Element
    const ctx = cvs.getContext('2d');                       // Setup the Canvas to 2D
    // const speed = 10;                                    // Define the Speed of the animaiton
    const ratio = window.devicePixelRatio                   // Define the DPI of the Screen

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
        setupCircles(10,canvasWidth/2,canvasHeight/2,(Math.random() * 5)+4);
    });

    // ###############################################################
    // ###############################################################

    // Function to draw Circles into the Canvas
    function Circle(radius,xPos,yPos,speed) {
        this.radius = radius;       // Radius of this object
        this.xPos = xPos;           // x position of this object
        this.yPos = yPos;           // y position of this object
        this.speed = speed;         // Movementspeed of the Soundwave

        // Update the radius of the circle every frame,
        // indipendent from other Circles
        this.update = function(){
            this.radius += (this.speed*ratio); // Update the radus of this Circle
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
    function setupCircles(r,x,y,s) {
        var circle = new Circle(r,x,y,s);     // Create new Circle Object
        circles.push(circle);                 // Add Circle Object to the array
    }

    // Start the Canvas Animation
    draw();

    // Function that get triggert 60 times every second
    // so this function creaetes the animation in the background
    function draw() {
        // This line clear the canvas every Frame,
        // without this line, every circles would stay
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        for(var i = 0; i < circles.length;i++) {
            var newCircle = circles[i];
            newCircle.update();
        }
        // this line request this function every frame
        requestAnimationFrame(draw);
    }
}
