import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Sound, SoundType } from '../../classes/sound';
import { NgForOf } from '@angular/common';
/**
 * Generated class for the EmojiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
	selector: 'page-edit',
	templateUrl: 'edit.html',
})
export class EditPage {
	sound: Sound;
	beatGrid: number[][];
	tmpBeatGrid :number[][] = [];


	beatPreviewSlider: HTMLElement;
	beatgridWrapperPreview: HTMLElement;
	beatgrid: HTMLElement;


	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.sound = new Sound(SoundType.Bass);
		this.sound.clearBeatGrid();
		this.beatGrid = this.sound.getBeatGrid();

		//console.log(this.beatGrid);

		for (var i : number = 0; i < 5; i++){
			this.tmpBeatGrid[i] = [];
			for (var j: number = 0; j < 32; j++){
				this.tmpBeatGrid[i][j] = 0;
			}
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditPage');

		var beatgridWrapper: HTMLElement = document.getElementById('beatgrid-wrapper');
		this.beatgrid= document.getElementById('beatgrid');
		beatgridWrapper.style.height = (this.beatgrid.offsetHeight)+"px";

		this.beatgridWrapperPreview = document.getElementById('beatgrid-wrapper-preview');
		var beatrowPreview: HTMLElement = document.getElementById('beatrow-preview');
		this.beatgridWrapperPreview.style.width = (beatrowPreview.offsetWidth +10)+"px";


		this.beatPreviewSlider = document.getElementById('beatpreview-slider');
		
	}

	reloadGrid(){
		var cvs: HTMLCollectionOf<Element> = document.getElementsByClassName('tone');
		for(var i: number=0; i < cvs.length; i++){
			var x = +cvs[i].id.split("-")[0];
			var y = +cvs[i].id.split("-")[1];

			if(this.sound.getBeatGrid()[x][y] == 0){
				cvs[i].classList.remove("tone-selected");
			} else {
				cvs[i].classList.add("tone-selected");
			}
		}
	}

	clearSound(){
		this.sound.clearBeatGrid();
		this.reloadGrid();
		this.syncSmallGrid();
	}

	syncSmallGrid(){

	}

	clicked(evt: MouseEvent){

		var elem : HTMLDivElement = <HTMLDivElement> evt.target;

		var x: number = +elem.id.split("-")[0];
		var y: number = +elem.id.split("-")[1];

		if(elem.classList.toggle("tone-selected")){
			this.sound.setBeatGridAtPos(x, y, 1);
			
		} else {
			this.sound.setBeatGridAtPos(x, y, 0);
		}
		//console.log(this.sound.getBeatGrid());
	}

	dragSlider(evt: any){
		console.log(evt);
	}

	panPreview(evt: any){
		


		
		var x: number = evt.srcEvent.clientX - (this.beatPreviewSlider.offsetWidth/2);
		var prevXMin: number = (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)/2;
		var prevXMax: number = (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)/2;

		this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin,x),prevXMax) + "px";

		//console.log(beatgrid.offsetWidth / slider.offsetWidth);

		this.beatgrid.style.transform = "translate( " + (-1 * (Math.min(Math.max(prevXMin,x),prevXMax) * 5.3 - 275)) + "px , 0)";
	}

/*
	clickPreview(evt: any){
		console.log(evt.x);
		var slider: HTMLElement = document.getElementById('beatpreview-slider');
		console.log(slider);
		slider.style.left = Math.min(Math.max(50,(evt.x - 70)),350) + "px";
	}
*/
}
