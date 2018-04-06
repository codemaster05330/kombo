import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

// import { Observable } from 'rxjs/Observable';
// import { Jsonp } from '@angular/http';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	constructor(public gyroscope:Gyroscope, public devMotion:DeviceMotion, public platform:Platform) {
	}

	public isFlipItGesture():boolean {
		this.platform.ready().then((readyState) => {
			// let options: GyroscopeOptions = {
			//    frequency: 1000
			// };

			// this.gyroscope.getCurrent()
			// 	.then((orientation: GyroscopeOrientation) => {
			// 		console.log(orientation.x, orientation.y, orientation.z, orientation.timestamp);
			// });

			let acc_opts:DeviceMotionAccelerometerOptions = {
				frequency: 100
			}

			this.devMotion.watchAcceleration(acc_opts).subscribe((acceleration: DeviceMotionAccelerationData) => {
				console.log(roundFloat(acceleration.x, 1), roundFloat(acceleration.y, 1), roundFloat(acceleration.z, 1), acceleration.timestamp);
			});

		});
		return true;
	}

}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}