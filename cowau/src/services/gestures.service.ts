import { Injectable } from '@angular/core';

// import { Observable } from 'rxjs/Observable';
// import { Jsonp } from '@angular/http';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';


@Injectable()
export class GesturesService {
	constructor(private gyroscope:Gyroscope) {

	}

	public isFlipItGesture():boolean {
		let options: GyroscopeOptions = {
		   frequency: 1000
		};

		this.gyroscope.getCurrent(options)
			.then((orientation: GyroscopeOrientation) => {
				console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
			})
		  	.catch()
		return true;
	}

}