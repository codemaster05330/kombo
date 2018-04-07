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
	// j : number = 0;
	// cvs : any;


	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.sound = new Sound(SoundType.Bass);
		this.sound.clearBeatGrid();
		this.beatGrid = this.sound.getBeatGrid();
		//console.log(this.beatGrid);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditPage');
		// var cvs: = document.getElementById('content');
	}

	reloadGrid(){

	}

	setBeatAt(){

	}

	clicked(evt: MouseEvent){

		var elem : HTMLDivElement = <HTMLDivElement> evt.target;

		var x: number = +elem.id.split("-")[0];
		var y: number = +elem.id.split("-")[1];

		if(elem.classList.toggle("tone-selected")){
			//this.sound.setBeatGridAtPos(x, y, 1);		//TODO: FIX THIS FUCKER BECAUSE FOR SOME REASON IT FUCKS UP EVERFUCKINGTHING
			console.log("1");
		} else {
			this.sound.setBeatGridAtPos(x, y, 0);
			console.log("0");
		}
		//console.log(this.sound.getBeatGrid());
	}
}
