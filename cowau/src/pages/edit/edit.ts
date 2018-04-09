import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Sound, SoundType } from '../../classes/sound';
import { NgForOf } from '@angular/common';


@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class EditPage {
	sound: Sound;
	beatGrid: number[][];
	tmpBeatGrid :number[][] = [];

	vw: number;


	beatPreviewSlider: HTMLElement;
	beatgridWrapperPreview: HTMLElement;
	beatgrid: HTMLElement;
	beatgridWrapper: HTMLElement;
	beatgridPreview: HTMLCollectionOf<Element>;
	beatrowPreview: HTMLElement;


	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.sound = new Sound(SoundType.Bass);
		this.sound.clearBeatGrid();
		this.beatGrid = this.sound.getBeatGrid();

		for (var i : number = 0; i < 5; i++){
			this.tmpBeatGrid[i] = [];
			for (var j: number = 0; j < 32; j++){
				this.tmpBeatGrid[i][j] = 0;
			}
		}
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
	}

	reloadGrid(){
		var cvs: HTMLCollectionOf<Element> = document.getElementsByClassName('tone');
		for(var i: number=0; i < cvs.length; i++){
			var x = +cvs[i].id.split("-")[0];
			var y = +cvs[i].id.split("-")[1];

			if(cvs[i].children.length > 0){
				cvs[i].removeChild(cvs[i].children[0]);
			}

			if(this.sound.getBeatGrid()[x][y] == 0){
				cvs[i].classList.remove("tone-selected");
			} else {
				cvs[i].classList.add("tone-selected");
			}
		}
	}


	/*
	*		CLEAR SOUND TEXT
	*/


	clearSound(){
		this.sound.clearBeatGrid();
		this.reloadGrid();
		this.clearSmallGrid();
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

			if(elem.classList.toggle("tone-selected")){
				this.sound.setBeatGridAtPos(x, y, 1);
				this.setPreview(x, y, 1);
				
			} else {
				this.sound.setBeatGridAtPos(x, y, 0);
				this.setPreview(x, y, 0);
			}
		} else if (elem.classList.contains("tone-long")) {
			this.sound.setBeatGridAtPos(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]),0);
			this.setPreview(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]),0);
			elem.parentElement.removeChild(elem);
		}
		//console.log(this.sound.getBeatGrid());
	}


	//TODO: Prevent overlapping
	panTone(evt: any){
		var panLength :number = evt.deltaX;
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

			var longtone :HTMLElement = document.createElement("div");
			longtone.classList.add("tone-long");
			var width = 11.8 * (passedTones + 1) - 1;		//TODO: Account for measure gaps
			longtone.style.width =  width+"vw";
			tone.appendChild(longtone);

			this.setPreview(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));
			this.sound.setBeatGridAtPos(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));

		} else {
			
		}

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
					break;
				} else if (length == 1){
					this.beatgridPreview[i].classList.add("tone-selected-preview");
					break;
				} else if (length > 1){
					this.beatgridPreview[i].classList.remove("tone-selected-preview");
					var longtonePrev: HTMLElement = document.createElement("div");
					longtonePrev.classList.add("tone-long-preview");
					longtonePrev.style.width = 2 + 2.6 * (length-1) +"vw";				//TODO: Account for measure gaps
					this.beatgridPreview[i].appendChild(longtonePrev);
				}
			}
		}
	}
}
