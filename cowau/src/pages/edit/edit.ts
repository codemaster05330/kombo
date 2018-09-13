import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, Platform } from 'ionic-angular';
import { audioContext } from 'waves-audio';

//pages
import { IdlePage } from '../idle/idle';
// import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { ThrowItPopoverPage } from '../../throwit-popover/throwit-popover';
import { SwitchSoundPopoverPage } from '../../switchsound-popover/switchsound-popover';

//classes
import { Sequence, SoundType } from '../../classes/sequence';
import { Popover } from '../../classes/popover';
import { GestureType } from '../../classes/gesture-type';
import { Variables } from '../../classes/variables';

//services
import { GesturesService } from '../../services/gestures.service';
import { MetricSync } from '../../services/metric-sync.service';

//server
import { Socket } from 'ng-socket-io';

import * as audio from 'waves-audio';
const audioContext = audio.audioContext;
const audioScheduler = audio.getScheduler();

@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class EditPage {

	//////////////////////////////////////////////////////////////////////////
	//		SETUP
	//////////////////////////////////////////////////////////////////////////

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
	timeStamp: number = 0;
	translation: number;
	relativeX: number;

	wasEmpty: boolean = true;
	originalTarget: HTMLElement;
	previousPassedTones: number;

	popover:Popover;

	// lookOfEvents:Array<GestureType> = [GestureType.FLIPPED, GestureType.THROWN, GestureType.IDLE_IN];
	lookOfEvents:Array<GestureType> = [GestureType.THROWN, GestureType.IDLE_IN];
	// lookOfEvents:Array<GestureType> = [GestureType.FLIPPED, GestureType.THROWN];
	cursor: HTMLElement;
	previewCursor: HTMLElement;
	cursorPosition:number = 0;

	soundLengths: number[] = [];

	callback: any;

	throwPopoverInterval:any;

	ignoreInput: boolean = false;

	switchingSound: boolean = false;
	switchSoundPopover:any;

	constructor(private navCtrl: NavController, public navParams: NavParams, private events:Events, private gesturesService:GesturesService,
		private popoverCtrl:PopoverController, private metricSync:MetricSync, private socket:Socket, private globalVars: Variables,
		private zone:NgZone, private platform: Platform) {
		console.log('constructor edit');
		if(globalVars.currentSoundType == null){
			globalVars.currentSoundType = SoundType[SoundType[Math.floor(Math.random() * Object.keys(SoundType).length / 2)]];
		}
		this.sound = new Sequence(globalVars.currentSoundType);
		this.sound.clearBeatGrid();
		this.sound.setId(this.globalVars.emojiID);
		this.beatGrid = this.sound.getBeatGrid();

		for (let i : number = 0; i < 5; i++){
			this.tmpBeatGrid[i] = [];
			for (let j: number = 0; j < 16; j++){
				this.tmpBeatGrid[i][j] = 0;
			}
		}

		this.soundLengths = globalVars.soundLengths;

		//ONLY FOR TESTING PURPOSES
		if(globalVars.emojiID == null){
			globalVars.emojiID = Math.floor(Math.random() * 12);
			console.log("Emoji was null. Randomly generated: " + globalVars.emojiID)
		}
		// this.sound.setType(SoundType.Harm1);

		//Start Gesture Events
		this.popover = new Popover(this.popoverCtrl);

		this.gesturesService.watchForGesture(this.lookOfEvents);
		//THROW
		this.events.subscribe(GestureType.THROWN.toString(), (value) => {
			// what to do when thrown. TODO: remove comment when gestures are stable, remove the popover page from above
			if(this.getBeatGridMagnitude() > 0){
				this.socket.emit('new-sequence', this.sound);
			}
			//fancy animation
			let divsToThrow = document.getElementsByClassName("tone-long");
			for(let i = 0; i < divsToThrow.length; i++){
				divsToThrow[i].classList.add("animation-throwit");
			}
			this.ignoreInput = true;
			setTimeout(() => {
				this.clearSound();
			}, 700);
		});

		//FLIPPING
		// this.events.subscribe(GestureType.FLIPPED.toString(), (value) => {
		// 	// what to do when flipped. TODO: remove comment when gestures are stable, remove above popover call when it's been rewritten
		// 	this.sound.nextType();
		// 	this.globalVars.currentSoundType = this.sound.getType();
		// 	this.popover.show(NewSoundPopoverPage, 2000);
		// 	this.cutSoundsIfNeeded();
		// });

		//IDLE IN
		this.events.subscribe(GestureType.IDLE_IN.toString(), (value) => {
			this.gesturesService.stopGestureWatch(this.events, GestureType.THROWN);
			this.gesturesService.stopGestureWatch(this.events, GestureType.IDLE_IN);
			this.metricSync.removeMetronome(this.callback);
			this.zone.run(() => {
				this.navCtrl.setRoot(IdlePage);
			});
		});

		//Throw it popover
		setTimeout(() => {
			this.popover.show(ThrowItPopoverPage, 5000);
		}, 5000);
		this.throwPopoverInterval = setInterval(() => {
			this.popover.show(ThrowItPopoverPage, 2000);
		}, 120000);
	}

	ionViewDidLoad() {
		// getting a bunch of variables that are needed many times later.
		this.beatgridWrapper = document.getElementById('beatgrid-wrapper');
		this.beatgrid= document.getElementById('beatgrid');
		this.beatgridWrapper.style.height = (this.beatgrid.offsetHeight)+"px";

		this.beatgridWrapperPreview = document.getElementById('beatgrid-wrapper-preview');
		this.beatrowPreview = document.getElementById('beatrow-preview');
		this.beatgridWrapperPreview.style.width = (this.beatrowPreview.offsetWidth +1)+"px";

		this.cursor = document.getElementById('cursor');
		this.previewCursor = document.getElementById('beatpreview-cursor');

		this.beatPreviewSlider = document.getElementById('beatpreview-slider');
		this.beatgridPreview = document.getElementsByClassName('tone-preview');


		// set some initial offsets/transforms
		this.beatPreviewSlider.style.left = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + "px";

		this.vw = (this.beatgridWrapper.offsetWidth / 100);

		this.beatgrid.style.transform = "translate( -5vw , 0)";


		// this.metricSync.removeMetronome((measure, beat) => {});
		// init metric sync
		// this.initServerConnection().then(() => {
			// this.initMetrics();
		// });

		this.runMetronome();

		// debug thingy to test that the sent sequence indeed was sent to the server and can be recieved again.
		// TODO: can be removed when the visual screen is getting it's sequences from the server correctly
		// this.getNewSequence().subscribe(data => {

		// });

		this.cursor.style.transform = "translate(-200vw, 0px)";
	}

	//////////////////////////////////////////////////////////////////////////
	//	SYNCRONISED THINGS
	//////////////////////////////////////////////////////////////////////////

	// connects to the server and prints a success message into the log when connected.
	// change IP adress in app.module.ts' config var
	// initServerConnection() {
	// 	const socket = this.socket;

	// 	socket.connect();
	// 	socket.emit('request');

	// 	// client/server handshake
	// 	const promise = new Promise((resolve, reject) => {
	// 		socket.on('acknowledge', (data) => {
	// 			console.log('Connected to server!');
	// 			resolve();
	// 		});
	// 	});

	// 	return promise;
	// }

	// debug thingy to test that the sent sequence indeed was sent to the server and can be recieved again.
	// TODO: can be removed when the visual screen is getting it's sequences from the server correctly
	// getNewSequence(){
	// 	let observable = new Observable(observer => {
	// 		this.socket.on('new-sequence', (data) =>{
	// 			console.log(data);
	// 		});
	// 	});
	// 	return observable;
	// }


	// initialises MetricSync which also adds functions for the movement of the cursor and plays the sounds of the preview
	runMetronome() {
		this.callback = (measure, beat) => {
			this.moveCursorTo((measure % 2) * 8 + beat);				// Cursor Movement //@Johannes: Hier stürzt es ab.
			if(this.switchingSound) return;
			let beatGrid = this.sound.getBeatGrid();

			for(let i: number = 0; i < beatGrid.length; i++){			// Shift through the beatgrid
				if(beatGrid[i][(measure % 2) * 8 + beat] > 0){			// Play sound if there is one in the grid at the next beat.
																		// (measure % maxMeasures) * beatsPerMeasure
					this.playSound(this.sound.type, 4 - i, beatGrid[i][(measure % 2) * 8 + beat]); // 4 - i because lowest row is highest number
				}
			}
		};

		this.metricSync.addMetronome(this.callback, 8, 8, 2);
	}


	// Function that plays specific sounds when needed.
	playSound(type:SoundType,pitch:number,length:number) {
		// Get Time from Server
		const time = audioScheduler.currentTime;	                            // Sync Time
		const src = audioContext.createBufferSource();                          // Create Source
		const gainC = audioContext.createGain();

		// Play Audio File
		gainC.connect(audioContext.destination);
		src.connect(gainC);                                  					// Connect Audio Context
		src.buffer = this.globalVars.buffers[type];                             // Define witch sound the function is playing

		let endTime;
		if (this.globalVars.cutSound[type]){
			endTime = time + Math.min(length, this.soundLengths[type]) * 0.25;
		} else {
			endTime = time + 8 * 0.25;
		}

		src.start(time, pitch * 3, endTime + 0.1);								// Start Sound
		gainC.gain.value = this.globalVars.soundGains[type];
		gainC.gain.setTargetAtTime(0, endTime - 0.05, 0.015);					// Fade Out
	}

	decibelToLinear(value: number){
		return Math.pow(10, value/20);
	}


	// Legacy Function that moves Cursor to the next position. Used originally when there was no server available. Can probably be removed.
	moveCursorNext(){
		this.cursorPosition++;
		if (this.cursorPosition >= 16){											// Jump back to 0 if end reached
			this.cursorPosition = 0;
		}

		this.moveCursorTo(this.cursorPosition);									// call generalised function
	}

	// Function to move the cursor in the screen to the correct position using translation
	moveCursorTo(pos: number = 0){
		if (pos < 0 || pos >= 16) return;										// Don't do anything if the position is out of bounds
		this.cursorPosition = pos;

		let translation: number = this.cursorPosition * 12;						// move cursor over by 12vw per passed tone (tone-width 10vw + 1vw margin each side)
		translation += Math.floor((this.cursorPosition) / 8) * 8;				// add an additional 8vw for each passed measure to bridge the gap (left-margin 1vw -> 9vw)

		this.cursor.style.transform = "translate(" + translation + "vw, 0px)";	// actually move the cursor

		this.movePreviewCursorTo(pos);
	}

	movePreviewCursorTo(pos: number = 0){
		let translation: number = this.cursorPosition * 2.6;
		translation += Math.floor((this.cursorPosition)/8) * 0.8;
		this.previewCursor.style.transform = "translate(" + translation + "vw, 0px)";
	}


	//////////////////////////////////////////////////////////////////////////
	//		CLEAR & RESET SOUND & GRID
	//////////////////////////////////////////////////////////////////////////

	// reload the viewable grid according to the beatgrid
	// called mostly after doing mass-changes to the grid automatically, such as random filling.
	// probably not used in production
	// also fills the small grid, but doesn't clear the small one previously
	reloadGrid(){
		let cvs: HTMLCollectionOf<Element> = document.getElementsByClassName('tone');
		for(let i: number=0; i < cvs.length; i++){
			let x = +cvs[i].id.split("-")[0];
			let y = +cvs[i].id.split("-")[1];

			if(cvs[i].children.length > 0){
				cvs[i].removeChild(cvs[i].children[0]);							// remove every longtone on the visual grid
			}

			let num: number = this.sound.getBeatGrid()[x][y];

			if(num > 0){
				let tone : HTMLElement = this.createLongTone(this.calculateLongToneWidth(num - 1,y));
				cvs[i].appendChild(tone);										// add new tone in the grid
				this.setPreview(x, y, num);										// add new tone in the preview
			}
		}
	}


	// function called when the clear sound button is pressed.
	// often used during development to test different functionalities, thus so many commented function calls.
	// TODO: clean up for production but NOT before that. it's a good position to test functionality
	clearSound(){
		// this.sound.fillBeatGridAtRandom();
		// this.sound.setId(1);
		// if(this.getBeatGridMagnitude() > 0){
		// 	this.socket.emit('new-sequence', this.sound);
		// }

		this.ignoreInput = false;
		this.sound.clearBeatGrid();
		this.clearSmallGrid();
		// this.cloneFirstMeasure();
		this.reloadGrid();
		// console.log(this.sound.getBeatGrid());
	}

	clearSoundButton(){
		this.ignoreInput = true;
		let divsToThrow = document.getElementsByClassName("tone-long");
		for(let i = 0; i < divsToThrow.length; i++){
			divsToThrow[i].classList.add("animation-clear");
		}
		setTimeout(() => {
			this.clearSound();
		}, 500);
	}

	switchSound(){
		// this.sound.nextType();
		// this.globalVars.currentSoundType = this.sound.getType();
		this.sound.setType(this.globalVars.currentSoundType);
		this.cutSoundsIfNeeded();
	}

	//removes
	clearSmallGrid(){
		for(let i = 0; i < this.beatgridPreview.length; i++){
			if(this.beatgridPreview[i] != null){
				this.beatgridPreview[i].classList.remove("tone-selected-preview");
				if (this.beatgridPreview[i].children.length > 0){
					this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0]);
				}
			}
		}
	}

	changeSoundButton() {
		this.switchSoundPopover = this.popoverCtrl.create(SwitchSoundPopoverPage, {
			showBackdrop: true,
			enableBackdropDismiss: true
		});
		this.switchingSound = true;
		this.switchSoundPopover.present();
		this.switchSoundPopover.onDidDismiss(() => {
			this.switchSound();
			this.switchingSound = false;
		});
		console.log("Change Sound");
	}



	//////////////////////////////////////////////////////////////////////////
	//		USER INPUT & GRID HANDLING
	//////////////////////////////////////////////////////////////////////////


	// function called when a tone is pressed for longer than 200ms to run a short vibration
	longPress(){
		console.log("longpress");
	}

	// function called when a tone is clicked
	clickedTone(evt: MouseEvent){
		if(this.ignoreInput) return;

		let elem : HTMLDivElement = <HTMLDivElement> evt.target;
		if(this.platform.is("ios") && evt.timeStamp - this.timeStamp < 100) return;
		if(elem != null)
		{
			if(elem.classList.contains("tone")){							// clicked element is an empty tone: create tone with length 1
				let x: number = +elem.id.split("-")[0];
				let y: number = +elem.id.split("-")[1];
				this.sound.setBeatGridAtPos(x, y, 1);
				this.setPreview(x, y, 1);
				elem.appendChild(this.createLongTone());

			} else if (elem.classList.contains("tone-long")) {				// clicked element is an existing tone: remove the tone
				let x: number = +elem.parentElement.id.split("-")[0];
				let y: number = +elem.parentElement.id.split("-")[1];
				this.sound.setBeatGridAtPos(x, y, 0);
				this.setPreview(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]),0);
				elem.parentElement.removeChild(elem);
			}
		}
	}


	// function called when a pan gesture happening (aka moving your finger left/right)
	panTone(evt: any){
		this.timeStamp = evt.timeStamp;

		// detect if a new pan has been started and start a new (internal) event accordingly. internal because angular will thrown an event every time the finger is being moved slightly, even when inside the same pan gesture
		//this.deltaTime holds the starttime of the event. 20 because the evt.timeStamp - evt.deltaTime sometimes fluctuates a little bit.
		if (evt.timeStamp - evt.deltaTime - 20 > this.deltaTime && evt.target != null){		// is entered if it's a new gesture

			//if the delay between the click and the movement is above 200ms or the use didn't click on a tone, don't scroll but create a long tone instead.
			//TODO: Haptic Feedback when passing the time threshold
			if (evt.deltaTime > 200 && !(evt.target.classList.contains("beatgrid") || evt.target.classList.contains("beatrow"))){
				this.isScrolling = false;
			} else {
				this.isScrolling = true;
			}

			//get the current translation of the main beatgrid at the start of the event to be able to move it accordingly later
			this.translation = parseInt(this.beatgrid.style.transform.slice(10).split("vw")[0]);

			if(!this.isScrolling){
				//save the relative X of the start of the event relative to the parent element
				//this is used to make the drawing of new tones while panning more consistent

				//get middle x coordinate of the parent element1
				let middleX: number = evt.target.getBoundingClientRect().left + (evt.target.offsetWidth / 2);
				//get starting point of the users click
				let startX: number = evt.center.x - evt.deltaX;

				this.relativeX = startX - middleX;

			}

			this.originalTarget = evt.target;
			this.wasEmpty = true;

			if (evt.target.classList.contains("tone-long")){
				this.wasEmpty = false;
				this.originalTarget = this.originalTarget.parentElement;			//move the saved target up the hierarchy so it is the empty tone, not the filled one
				if(this.sound.getBeatGrid()[this.originalTarget.id.split("-")[0]][this.originalTarget.id.split("-")[1]] == 1){
					//if clicked tone is a single long tone, remove that tone and revert to standard "new tone" procedure
					this.wasEmpty = true;
					this.sound.setBeatGridAtPos(+this.originalTarget.id.split("-")[0], +this.originalTarget.id.split("-")[0], 0);
					this.setPreview(+this.originalTarget.id.split("-")[0], +this.originalTarget.id.split("-")[0], 0);
					this.originalTarget.removeChild(this.originalTarget.children[0]);
				} else {
					//this part is used to detect which part of the tone the movement starts from. only needed if tones need to be redrawn.
					//can be removed if this functionality won't be needed.

					//if clicked tone is a longer longtone, calculate which part of the note you were clicking on, specifically if it was
					//the first beat, the last beat or any beat inbetween
					//Theoretical-todo: calculate which "beat" I am starting my movement at

				}
			}

			this.previousPassedTones = 0;
			this.deltaTime = evt.timeStamp - evt.deltaTime;

		}


		//if the current pan gesture is a scroll gesture, move the screen
		if(this.isScrolling){
			let translate: number = (this.translation * this.vw + evt.deltaX) / this.vw;
			translate = Math.max(Math.min(-5,translate),-112);						//109 & 5 are an empirical number. if there is a better source for a more accurate number, it should be entered here.

			this.beatgrid.style.transform = "translate( " + translate + "vw , 0)";

			//move the preview as well
			let prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
			let x: number = -1 * ( ( ( translate + 5) / 104 ) * (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) + prevXMin;		//again, 109 and 5 are the empirical numbers from above.
			let prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth + 4;

			this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		}


		// if the current pan gesture is a drawing gesture, create the new tones
		else {

			if(this.ignoreInput) return;

			//calculate how many tones have been passed
			let y: number = +this.originalTarget.id.split("-")[1];
			let x: number = +this.originalTarget.id.split("-")[0];
			let passedTones = Math.floor(((this.relativeX + evt.deltaX) / this.vw) / 11.1);	//11.1vw is the width of one tone + one side of the margin (.1 because of the border)
			if(passedTones < 0)
				passedTones++;							// account for an error in the upper calculation if the drawing gesture is to the left

			//if we pass a gap, wait longer before a new tone is passed
			if (Math.floor((y + passedTones) / 8) != Math.floor(y / 8)){
				if(evt.deltaX > 0)
					passedTones = Math.floor(((this.relativeX + evt.deltaX - (Math.sign(evt.deltaX) * 9 * this.vw)) / this.vw) / 11.1);
				else
					passedTones = Math.floor(((this.relativeX + evt.deltaX - (Math.sign(evt.deltaX) * 9 * this.vw * 2)) / this.vw) / 11.1);
			}

			//if we are at one of the ends, cut it off if it somehow were to be bigger than the actual available tones.
			if (y+passedTones < 0){
				passedTones = -y;
			} else if (y+passedTones >= 16){
				passedTones = 15 - y;
			}

			//make sure the tones cannot be longer than the max length of the current soundtype
			if(passedTones > 0 && passedTones > this.soundLengths[this.sound.getType()] - 1){
				passedTones = this.soundLengths[this.sound.getType()] - 1;
			}
			if(passedTones < 0 && passedTones < -1 * this.soundLengths[this.sound.getType()] + 1){
				passedTones = -1 * this.soundLengths[this.sound.getType()] + 1;
			}


			//remove obsolete divs from the left that are leftover from creating new ones when drawing to the left
			if(this.previousPassedTones < 0){
				let target: HTMLElement = this.originalTarget;
				for(let i: number = this.previousPassedTones; i < 0; i++){
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

			// if it was an empty one originally we draw new tones
			if(this.wasEmpty){

				let target: HTMLElement = this.originalTarget;
				if(target.children.length > 0){
					target.removeChild(target.children[0]);
				}
				this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1], 0);
				this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], 0);

				//prevent drawing over notes to the left
				if(passedTones < 0){
					let beatGrid = this.sound.getBeatGrid();
					for(let i: number = 0; i < y; i++){
						if(i + beatGrid[x][i] > y + passedTones && beatGrid[x][i] > 0){
							passedTones = (y - (beatGrid[x][i] + i)) * -1;
							//set previous Passed Tones so it won't get removed anyway in the next iteration
							this.previousPassedTones = passedTones;
						}
					}
				}

				//remove additionally added tones & move target to the left if passedTones is negative
				for(let i: number = passedTones; i < 0; i++){
					if(target.previousElementSibling != null){
						target = <HTMLElement> target.previousElementSibling;
						if(target.children.length > 0){
							target.removeChild(target.children[0]);
						}
					}
				}

				//prevent drawing over notes to the right
				let tmp: HTMLElement = target;
				for(let i: number = 0; i < passedTones; i++){
					if(tmp.nextElementSibling != null){
						tmp = <HTMLElement> tmp.nextElementSibling;
						if(tmp.children.length > 0){
							passedTones = i;
							break;
						}
						this.setPreview(+tmp.id.split("-")[0],+tmp.id.split("-")[1], 0);
						this.sound.setBeatGridAtPos(+tmp.id.split("-")[0],+tmp.id.split("-")[1], 0);
					}
				}

				//actually draw the new tones in both the preview and the grid
				target.appendChild(this.createLongTone(this.calculateLongToneWidth(passedTones, y)));
				this.setPreview(+target.id.split("-")[0],+target.id.split("-")[1],Math.abs(passedTones)+1);
				this.sound.setBeatGridAtPos(+target.id.split("-")[0],+target.id.split("-")[1], Math.abs(passedTones) + 1);
			}

			//if it was an occupied one originally
			else {
				//if a redrawing of the tones should be possible, it needs to be implemented here.
				this.previousPassedTones = 0;		//make sure it won't delete tones to the left by accident
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////
	//		LONG TONE SUPPORT FUNCTIONS
	//////////////////////////////////////////////////////////////////////////

	//handle creation of a new tone element with a defined width. 10 is the width of a single tone
	createLongTone(width :number = 10): HTMLElement{
		let longtone :HTMLElement = document.createElement("div");
		longtone.setAttribute("style", "animation-delay: " + Math.floor(Math.random() * 200).toString() + "ms;");
		// console.log(longtone.style.animationDelay);
		longtone.classList.add("tone-long");
		longtone.style.width =  width+"vw";
		return longtone;
	}

	//calculate the width of a tone according to the amount of passed tones (which is the length - 1) and the y position
	calculateLongToneWidth(passedTones:number, y: number){
		let width = 10 + 12 * Math.abs(passedTones);					//10 vw per tone, 12 per additional tone (10 + 1 margin on each side)
		if ((Math.floor(y / 8) != Math.floor((y+passedTones)/ 8) || ((passedTones) / 8 >= 1))){
			width += 8;													//8 additional if a measure gap is crossed (additional 8vw margin on the left of a tone)
		}
		return width;
	}

	//////////////////////////////////////////////////////////////////////////
	//		PREVIEW SLIDER
	//////////////////////////////////////////////////////////////////////////

	//called when the slider on the preview is pulled, moves the slider to the clicking position & the beatgrid to the according position
	panPreview(evt: any){
		let x: number;
		if (evt.srcEvent.clientX > 0) {
			x = evt.srcEvent.clientX - (this.beatPreviewSlider.offsetWidth/2);
		} else {
			x = evt.center.x - (this.beatPreviewSlider.offsetWidth/2);
		}
		let prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
		let prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth + 4;

		this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin,x),prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 104) - 5) + "vw , 0)";
	}

	//called, when the slider or the preview itself is clicked, moves the slider to the correct position as well as the beatgrid
	clickPreview(evt: any){
		let x: number = evt.x - (this.beatPreviewSlider.offsetWidth/2);
		let prevXMin: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2);
		let prevXMax: number = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth + 4;

		this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";
		this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin,x),prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 104) - 5) + "vw , 0)";

	}

	//sets a tone inside the preview grid
	setPreview(x: number, y: number, length: number){
		for(let i = 0; i < this.beatgridPreview.length; i++){
			let xp:number = +this.beatgridPreview[i].id.split("-")[0];
			let yp:number = +this.beatgridPreview[i].id.split("-")[1];
			if (xp == x && yp == y){
				if (this.beatgridPreview[i].children.length > 0){
					this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0])
				}
				if(this.beatgridPreview[i] != null) {
					if(length == 0){
						this.beatgridPreview[i].classList.remove("tone-selected-preview");
						break;
					} else if (length == 1){
						this.beatgridPreview[i].classList.add("tone-selected-preview");
						break;
					} else if (length > 1){
						this.beatgridPreview[i].classList.remove("tone-selected-preview");
						let longtonePrev: HTMLElement = document.createElement("div");
						longtonePrev.classList.add("tone-long-preview");
						let divLength = 2 + 2.6 * (length-1);
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


	//////////////////////////////////////////////////////////////////////////
	//			Support Functions
	//////////////////////////////////////////////////////////////////////////

	//just a small fun function that allows you to clone what you created in the first measure to all the other measures.
	//probably will never be used in the release, but it's a good for testing things quickly.
	cloneFirstMeasure(){
		for(let i: number = 0; i < this.sound.beatGrid.length; i++){
			for(let j: number = 0; j < 8; j++){
				this.sound.setBeatGridAtPos(i, j + 8, this.sound.getBeatGrid()[i][j]);
				this.sound.setBeatGridAtPos(i, j + 16, this.sound.getBeatGrid()[i][j]);
				this.sound.setBeatGridAtPos(i, j + 24, this.sound.getBeatGrid()[i][j]);
			}
		}

		this.reloadGrid();
	}

	//calculate how many tones are in the grid in total
	getBeatGridMagnitude() : number {
		let amount: number = 0;
		for(let i : number = 0; i < this.sound.getBeatGrid().length; i++){
			for(let j: number = 0; j < this.sound.getBeatGrid()[0].length; j++){
				amount += this.sound.getBeatGrid()[i][j];
			}
		}
		return amount;
	}

	//cut the existing tones to the max allowed length of the sound
	cutSoundsIfNeeded(){
		let beatGrid = this.sound.getBeatGrid();

		for(let i = 0; i < beatGrid.length; i++){
			for(let j = 0; j < beatGrid[i].length; j++){
				beatGrid[i][j] = Math.min(this.soundLengths[this.sound.getType()], beatGrid[i][j]);
			}
		}

		this.clearSmallGrid();
		this.reloadGrid();
	}

	ionViewWillLeave() {
        console.log('will close edit');
        clearInterval(this.throwPopoverInterval);
    }

    ionViewDidLeave() {
        console.log('closed edit');
    }

}
