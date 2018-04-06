import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad EditPage');
	}

}
