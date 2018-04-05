import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
// import { Jsonp } from '@angular/http';


@Injectable()
export class GesturesService {
	
	constructor() {

	}

	public isFlipItGesture():boolean {
		
		return true;
	}

}