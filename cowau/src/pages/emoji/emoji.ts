import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EmojiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
	selector: 'page-emoji',
	templateUrl: 'emoji.html',
})
export class EmojiPage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EmojiPage');
	}

	clickMe(evt: MouseEvent){
		console.log(evt.currentTarget);
		var elem: HTMLDivElement = <HTMLDivElement> evt.currentTarget;
		console.log(elem.id);

	}

	

}
