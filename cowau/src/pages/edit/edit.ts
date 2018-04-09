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
	beatgridWrapper: HTMLElement;
	beatgridPreview: HTMLCollectionOf<Element>;


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

		this.beatgridWrapper = document.getElementById('beatgrid-wrapper');
		this.beatgrid= document.getElementById('beatgrid');
		this.beatgridWrapper.style.height = (this.beatgrid.offsetHeight)+"px";

		this.beatgridWrapperPreview = document.getElementById('beatgrid-wrapper-preview');
		var beatrowPreview: HTMLElement = document.getElementById('beatrow-preview');
		this.beatgridWrapperPreview.style.width = (beatrowPreview.offsetWidth +1)+"px";


		this.beatPreviewSlider = document.getElementById('beatpreview-slider');

		this.beatgridPreview = document.getElementsByClassName('tone-preview');

		this.beatPreviewSlider.style.left = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth)/2) + "px";
		
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
		this.clearSmallGrid();
	}

	clearSmallGrid(){
		for(var i = 0; i < this.beatgridPreview.length; i++){
			this.beatgridPreview[i].classList.remove("tone-selected-preview");
		}
	}

	clicked(evt: MouseEvent){

		var elem : HTMLDivElement = <HTMLDivElement> evt.target;

		var x: number = +elem.id.split("-")[0];
		var y: number = +elem.id.split("-")[1];

		if(elem.classList.toggle("tone-selected")){
			this.sound.setBeatGridAtPos(x, y, 1);
			for(var i = 0; i < this.beatgridPreview.length; i++){
				var xp:number = +this.beatgridPreview[i].id.split("-")[0];
				var yp:number = +this.beatgridPreview[i].id.split("-")[1];
				if (xp == x && yp == y){
					this.beatgridPreview[i].classList.add("tone-selected-preview");
					break;
				}
			}
			
		} else {
			this.sound.setBeatGridAtPos(x, y, 0);
			for(var i = 0; i < this.beatgridPreview.length; i++){
				var xp:number = +this.beatgridPreview[i].id.split("-")[0];
				var yp:number = +this.beatgridPreview[i].id.split("-")[1];
				if (xp == x && yp == y){
					this.beatgridPreview[i].classList.remove("tone-selected-preview");
					break;
				}
			}
		}
		//console.log(this.sound.getBeatGrid());
	}

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

}
