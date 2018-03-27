import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
	selector: 'page-idle',
	templateUrl: 'idle.html'
})
export class IdlePage {
	title:string = "";
	@Input() author:string = "";

	constructor(public navCtrl: NavController) {
		this.title = "COWAU";
	}

	appendString(): void{
		this.author = this.author + " hier";		
	}

	nextScreen():void{
		this.navCtrl.push(HomePage);
		console.log("next screen");
	}
}

