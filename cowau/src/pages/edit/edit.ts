import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NavController, NavParams, PopoverController, Platform, Events } from 'ionic-angular';

//pages
import { IdlePage } from '../idle/idle';
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../../throwit-popover/throwit-popover';

//classes
import { Sequence, SoundType } from '../../classes/sequence';
import { Popover } from '../../classes/popover';
import { GestureType } from '../../classes/gesture-type';

//services
import { GesturesService } from '../../services/gestures.service';
import { ClientMetricSync } from '../../services/metric-sync.client.service';

@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class EditPage {
	sound: Sequence;
	beatGrid: number[][];
	tmpBeatGrid :number[][] = [];

	vw: number;

	beatPreviewSlider: HTMLElement;
	beatgridWrapperPreview: HTMLElement;
	beatgrid: HTMLElement;
	beatgridWrapper: HTMLElement;
	beatgridPreview: HTMLCollectionOf<Element>;
	beatrowPreview: HTMLElement;

	isScrolling: boolean = false;
	deltaTime: number = 1000000;
	translation: number;
	relativeX: number;

	wasEmpty: boolean = true;
	originalTarget: HTMLElement;
	previousPassedTones: number;

	popover:Popover;

	lookOfEvents:Array<GestureType> = [GestureType.FLIPPED, GestureType.THROWN, GestureType.IDLE_IN];
	cursor: HTMLElement;
	cursorPosition:number = 0;


	constructor(public navCtrl: NavController, public navParams: NavParams, private platform:Platform, private events:Events, private gesturesService:GesturesService,
		private popoverCtrl:PopoverController, private metricSync:ClientMetricSync) {
		this.sound = new Sequence(SoundType.Bass);
		this.sound.clearBeatGrid();
		this.beatGrid = this.sound.getBeatGrid();

		for (var i : number = 0; i < 5; i++){
			this.tmpBeatGrid[i] = [];
			for (var j: number = 0; j < 32; j++){
				this.tmpBeatGrid[i][j] = 0;
			}
		}

		//Start Gesture Events
		this.popover = new Popover(popoverCtrl);
		platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				this.gesturesService.watchForGesture(this.lookOfEvents);
			}
		});
		
		//THROW
		this.events.subscribe(GestureType.THROWN.toString(), (value) => {
			// console.log('thrown event');
			this.popover.show(ThrowItPopoverPage, 1000);
		});
		
		//FLIPPING
		this.events.subscribe(GestureType.FLIPPED.toString(), (value) => {
			this.popover.show(NewSoundPopoverPage, 1000);
		});

		//IDLE IN
		this.events.subscribe(GestureType.IDLE_IN.toString(), (value) => {
			this.navCtrl.setRoot(IdlePage);
			this.gesturesService.stopGestureWatch(this.events, [GestureType.THROWN, GestureType.FLIPPED, GestureType.IDLE_IN]);
		});
	}

	ionViewDidLoad() {
		this.beatgridWrapper = document.getElementById('beatgrid-wrapper');
		this.beatgrid= document.getElementById('beatgrid');
		this.beatgridWrapper.style.height = (this.beatgrid.offsetHeight)+"px";

		this.beatgridWrapperPreview = document.getElementById('beatgrid-wrapper-preview');
		this.beatrowPreview = document.getElementById('beatrow-preview');
		this.beatgridWrapperPreview.style.width = (this.beatrowPreview.offsetWidth +1)+"px";


		this.beatPreviewSlider = document.getElementById('beatpreview-slider');

		this.beatgridPreview = document.getElementsByClassName('tone-preview');

		this.beatPreviewSlider.style.left = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + "px";
		
		this.vw = (this.beatgridWrapper.offsetWidth / 100);

		this.beatgrid.style.transform = "translate( -5vw , 0)";

		this.cursor = document.getElementById('cursor');

		//move the cursor every second.
		//TODO: move this to the metric sync scheduler
		// setInterval(() => {this.moveCursorNext();}, 250);
		this.initMetrics();
	}

    initMetrics() {
	    this.metricSync.start((cmd, ...args) => {}, (cmd, callback) => {}).then(() => {
	      	this.metricSync.addMetronome((measure, beat) => {
	        	this.moveCursorTo((measure % 4) * 8 + beat);
	        	console.log('metro:', measure % 4, beat);
	      	}, 8, 8);
	    });
    }

	moveCursorNext(){
		this.cursorPosition++;
		if (this.cursorPosition >= 32){
			this.cursorPosition = 0;
		}

		this.moveCursorTo(this.cursorPosition);
	}

	moveCursorTo(pos: number = 0){
		if (pos < 0 || pos >= 32) return;
		this.cursorPosition = pos;

		var translation: number = this.cursorPosition * 12;
		translation += Math.floor((this.cursorPosition) / 8) * 8;

		this.cursor.style.transform = "translate(" + translation + "vw, 0px)";
	}

	reloadGrid(){
		var cvs: HTMLCollectionOf<Element> = document.getElementsByClassName('tone');
		for(var i: number=0; i < cvs.length; i++){
			var x = +cvs[i].id.split("-")[0];
			var y = +cvs[i].id.split("-")[1];

			if(cvs[i].children.length > 0){
				cvs[i].removeChild(cvs[i].children[0]);
			}

			var num: number = this.sound.getBeatGrid()[x][y];

			if(num > 0){
				var tone : HTMLElement = this.createLongTone(this.calculateLongToneWidth(num - 1,y));
				cvs[i].appendChild(tone);
				this.setPreview(x, y, num);
			}
		}
	}


	/*
	*		CLEAR SOUND TEXT
	*/


	clearSound(){
		this.sound.clearBeatGrid();
		this.clearSmallGrid();

		// this.sound.fillBeatGridAtRandom();
		this.reloadGrid();
		// console.log(this.sound.getBeatGrid());
	}

	clearSmallGrid(){
		for(var i = 0; i < this.beatgridPreview.length; i++){
			this.beatgridPreview[i].classList.remove("tone-selected-preview");
			if (this.beatgridPreview[i].children.length > 0){
				this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0]);
			}
		}
	}



	/*
	*		ACTUAL TONES
	*/


	clickedTone(evt: MouseEvent){

		var elem : HTMLDivElement = <HTMLDivElement> evt.target;
		

		if(elem.classList.contains("tone")){
			var x: number = +elem.id.split("-")[0];
			var y: number = +elem.id.split("-")[1];
			this.sound.setBeatGridAtPos(x, y, 1);
			this.setPreview(x, y, 1);
			elem.appendChild(this.createLongTone());

		} else if (elem.classList.contains("tone-long")) {
			var x: number = +elem.parentElement.id.split("-")[0];
			var y: number = +elem.parentElement.id.split("-")[1];
			this.sound.setBeatGridAtPos(x, y, 0);
			this.setPreview(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]),0);
			elem.parentElement.removeChild(elem);
		}

		//this.deltaTime = 0;
	}


	//TODO: Prevent overlapping
	//TODO: Account for measure gaps
	panTone(evt: any){

		/*var panLength :number = evt.deltaX;
		var passedTones: number = Math.floor((panLength / this.vw) / 11.1);

		
		if(passedTones >= 0){
			var tone:HTMLElement = <HTMLElement> evt.target;

			if (tone.classList.contains("tone-long")){
				var tmp = tone;
				tone = tone.parentElement;
			}

			if (tone.children.length > 0){
				tone.removeChild(tone.children[0]);
			}

			var y: number = +tone.id.split("-")[1];
			//console.log(y + " " + ((10 + ((7 - (y % 8)) * 12)) * this.vw) + " " + panLength + "; " + ((10 + ((7 - (y % 8)) * 12)) * this.vw <= panLength));
			if (Math.floor((10 + ((7 - (y % 8)) * 12)) * this.vw) <= panLength){
				passedTones -= 1;
				panLength -= 9 * this.vw;
			}
			//console.log(passedTones);

			var longtone :HTMLElement = document.createElement("div");
			longtone.classList.add("tone-long");
			var width = 10 + 12 * (passedTones);
			if (((y % 8) - ((y+passedTones)% 8 + 1) >= 0 ) || ((passedTones) / 8 >= 1)){
				width += 9;
			}

			longtone.style.width =  width+"vw";
			tone.appendChild(longtone);

			this.setPreview(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));
			this.sound.setBeatGridAtPos(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));

		} else {
			
		}*/

		//detect if a new pan has been started.
		// if(evt.deltaTime < this.deltaTime){
		// console.log(evt.timeStamp-evt.deltaTime, this.deltaTime);
		if (evt.timeStamp - evt.deltaTime - 20 > this.deltaTime){
			//if the delay between the click and the movement is above 200ms don't scroll but move the screen
			//TODO: Haptic Feedback when passing the time threshold
			if (evt.deltaTime > 200 && !(evt.target.classList.contains("beatgrid") || evt.target.classList.contains("beatrow"))){
				this.isScrolling = false;
			} else {
				this.isScrolling = true;
			}
			//get the current translation of the main beatgrid to be able to move it accordingly.
			this.translation = parseInt(this.beatgrid.style.transform.slice(10).split("vw")[0]);
			
			if(!this.isScrolling){
				//save the relative X of the start of the event relative to the parent element
				//get middle x coordinate of the parent element1
				var middleX: number = evt.target.getBoundingClientRect().left + (evt.target.offsetWidth / 2);
				//get starting point of the users click
				var startX: number = evt.center.x - evt.deltaX;

				this.relativeX = startX - middleX;

			}

			this.originalTarget = evt.target;				
			this.wasEmpty = true;

			if (evt.target.classList.contains("tone-long")){
				this.wasEmpty = false;
				this.originalTarget = this.originalTarget.parentElement;
				if(this.sound.getBeatGrid()[this.originalTarget.id.split("-")[0]][this.originalTarget.id.split("-")[0]] == 1){
					//if clicked tone is a single long tone, remove that tone and revert to standard "new tone" procedure
					this.wasEmpty = true;
					this.sound.setBeatGridAtPos(+this.originalTarget.id.split("-")[0], +this.originalTarget.id.split("-")[0], 0);
					this.setPreview(+this.originalTarget.id.split("-")[0], +this.originalTarget.id.split("-")[0], 0);
					this.originalTarget.removeChild(this.originalTarget.children[0]);
				} else {
					//if clicked tone is a longer longtone, calculate which part of the note you were clicking on, specifically if it was
					//the first beat, the last beat or any beat inbetween 
					//TODO: calculate which "beat" I am starting my movement at
					
				}



			}
			//console.log(this.originalTarget);
			this.previousPassedTones = 0;
			this.deltaTime = evt.timeStamp - evt.deltaTime;

		}

		
		if(this.isScrolling){		//if the current pan gesture is a scroll gesture, move the screen
			var translate: number = (this.translation * this.vw + evt.deltaX) / this.vw;
			translate = Math.max(Math.min(-5,translate),-319);

			this.beatgrid.style.transform = "translate( " + translate + "vw , 0)";

			//move the preview as well
			var prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
			var x: number = -1 * ( ( ( translate + 5) / 314 ) * (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) + prevXMin;
			var prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;

			this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		} 


		else {						// if the current pan gesture is a drawing gesture, create the new tones
			// var tone:HTMLElement = <HTMLElement> evt.target;
			// //if the target is a long one, get the actual target
			// if (tone.classList.contains("tone-long")){
			// 	var tmp = tone;
			// 	tone = tone.parentElement;
			// }
			// //if it already has a long one inside of it, remove it
			// if (tone.children.length > 0 && tone.classList.contains("tone")){
			// 	tone.removeChild(tone.children[0]);
			// 	this.setPreview(+tone.id.split("-")[0],+tone.id.split("-")[1], 0);
			// }

			//calculate passed tones
			var y: number = +this.originalTarget.id.split("-")[1];
			var x: number = +this.originalTarget.id.split("-")[0];
			var passedTones = Math.floor(((this.relativeX + evt.deltaX) / this.vw) / 11.1);	//11.1vw is the width of one tone + one side of the margin	
			if(passedTones < 0)
				passedTones++;

			//if we pass a gap, wait longer.
			if (Math.floor((y + passedTones) / 8) != Math.floor(y / 8)){
				if(evt.deltaX > 0)
					passedTones = Math.floor(((this.relativeX + evt.deltaX - (Math.sign(evt.deltaX) * 9 * this.vw)) / this.vw) / 11.1);
				else
					passedTones = Math.floor(((this.relativeX + evt.deltaX - (Math.sign(evt.deltaX) * 9 * this.vw * 2)) / this.vw) / 11.1);
				//console.log("tones " + passedTones);
			}

			//if we are at one of the ends, cut it short
			if (y+passedTones < 0){
				passedTones = -y;
			} else if (y+passedTones >= 32){
				passedTones = 31 - y;
			}


			//remove obsolete divs from left
			if(this.previousPassedTones < 0){
				var target: HTMLElement = this.originalTarget;
				for(var i: number = this.previousPassedTones; i < 0; i++){
					if(target.previousElementSibling != null){
						target = <HTMLElement> target.previousElementSibling;
						if(target.children.length > 0 && target.classList.contains("tone")){
							target.removeChild(target.children[0]);
						}
						this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1], 0);
						this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], 0);
					}
				}
			}
			this.previousPassedTones = passedTones;

			// if it was an empty one originally
			if(this.wasEmpty){
				var target: HTMLElement = this.originalTarget;
				if(target.children.length > 0){
					target.removeChild(target.children[0]);
				}
				this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1], 0);
				this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], 0);

				//prevent drawing over notes to the left
				if(passedTones < 0){
					var beatGrid = this.sound.getBeatGrid();
					for(var i: number = 0; i < y; i++){
						if(i + beatGrid[x][i] > y + passedTones && beatGrid[x][i] > 0){
							passedTones = (y - (beatGrid[x][i] + i)) * -1;
							//set previous Passed Tones so it won't get removed anyways in the next iteration
							this.previousPassedTones = passedTones;
						}
					}
				}

				//remove additionally added tones & move target to the left if passedTones is negative
				for(var i: number = passedTones; i < 0; i++){
					if(target.previousElementSibling != null){
						// console.log(target.id);
						target = <HTMLElement> target.previousElementSibling;
						if(target.children.length > 0){
							target.removeChild(target.children[0]);
						}
						// this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1], 0);
						// this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], 0);
					}
				}

				//prevent drawing over notes to the right
				var tmp: HTMLElement = target; 
				for(var i: number = 0; i < passedTones; i++){
					if(tmp.nextElementSibling != null){
						tmp = <HTMLElement> tmp.nextElementSibling;
						if(tmp.children.length > 0){
							//tmp.removeChild(tmp.children[0])
							passedTones = i;
							//console.log(passedTones, i);
							break;
						}
						this.setPreview(+tmp.id.split("-")[0],+tmp.id.split("-")[1], 0);
						this.sound.setBeatGridAtPos(+tmp.id.split("-")[0],+tmp.id.split("-")[1], 0);
					}
				}

				// console.log(target.id);
				target.appendChild(this.createLongTone(this.calculateLongToneWidth(passedTones, y)));
				this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1],Math.abs(passedTones)+1);
				this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], Math.abs(passedTones) + 1);
			}

			//if it was an occupied one originally change it's size
			else {
				this.previousPassedTones = 0;
			}

			//console.log(passedTones);
		}
	}

	/*
	*		LONG TONE SUPPORT FUNCTIONS
	*/

	createLongTone(width :number = 10): HTMLElement{
		var longtone :HTMLElement = document.createElement("div");
		longtone.classList.add("tone-long");
		longtone.style.width =  width+"vw";
		return longtone;
	}

	calculateLongToneWidth(passedTones:number, y: number){
		var width = 10 + 12 * Math.abs(passedTones);
		if ((Math.floor(y / 8) != Math.floor((y+passedTones)/ 8) || ((passedTones) / 8 >= 1))){
			width += 8;
		}
		return width;
	}

	/*
	*		PREVIEW SLIDER
	*/

	panPreview(evt: any){
		
		var x: number = evt.srcEvent.clientX - (this.beatPreviewSlider.offsetWidth/2);
		var prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
		var prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;

		this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin,x),prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 314) - 5) + "vw , 0)";
	}


	clickPreview(evt: any){
		var x: number = evt.x - (this.beatPreviewSlider.offsetWidth/2);
		var prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
		var prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;

		this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin,x),prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 314) - 5) + "vw , 0)";

	}

	setPreview(x: number, y: number, length: number){
		for(var i = 0; i < this.beatgridPreview.length; i++){
			var xp:number = +this.beatgridPreview[i].id.split("-")[0];
			var yp:number = +this.beatgridPreview[i].id.split("-")[1];
			if (xp == x && yp == y){
				if (this.beatgridPreview[i].children.length > 0){
					this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0])
				}

				if(length == 0){
					this.beatgridPreview[i].classList.remove("tone-selected-preview");
					// console.log(this.beatgridPreview[i].id)
					break;
				} else if (length == 1){
					this.beatgridPreview[i].classList.add("tone-selected-preview");
					break;
				} else if (length > 1){
					this.beatgridPreview[i].classList.remove("tone-selected-preview");
					var longtonePrev: HTMLElement = document.createElement("div");
					longtonePrev.classList.add("tone-long-preview");
					var divLength = 2 + 2.6 * (length-1);
					if (Math.floor(y / 8) != Math.floor((y+length-1)/ 8)){
						divLength += 0.8;
					}
					longtonePrev.style.width = divLength +"vw";
					this.beatgridPreview[i].appendChild(longtonePrev);
				}
			}
		}
	}

}
