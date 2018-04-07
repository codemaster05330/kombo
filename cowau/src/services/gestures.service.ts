import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
// import { Jsonp } from '@angular/http';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	constructor(public devMotion:DeviceMotion, public gyroscope:Gyroscope, public platform:Platform) {
	}

	public isFlipItGesture():boolean {
		let flipping_x = new Array<any>();
		let flipping_y = new Array<any>();

		this.platform.ready().then((readyState) => {
			let treshold = 0.15;
			
			let gyro_opts: GyroscopeOptions = {
			   frequency: 500
			};
			
			let acc_opts:DeviceMotionAccelerometerOptions = {
				frequency: 500
			}

			this.gyroscope.watch(gyro_opts).subscribe((orientation: GyroscopeOrientation) => {
				if(flipping_x.length == 10) {
					console.log('hier');
					flipping_x = new Array<any>();
				}

				flipping_x.push({time: orientation.timestamp, value: orientation.x});
				// console.log(flipping_x);
				
			});

			// this.devMotion.watchAcceleration(acc_opts).subscribe((acceleration: DeviceMotionAccelerationData) => {
				// console.log(roundFloat(acceleration.x, 1), roundFloat(acceleration.y, 1), roundFloat(acceleration.z, 1), acceleration.timestamp);
			// });

		});
		return true;
	}

}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}