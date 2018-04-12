import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
// import { Jsonp } from '@angular/http';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	treshold:number = 0.15;

	motion_array = new Array<number>();
	motion_index = 0;

	constructor(public devMotion:DeviceMotion, public gyroscope:Gyroscope, public platform:Platform) {}

	public isFlipItGesture(acceleration:DeviceMotionAccelerationData):boolean {
		if(this.motion_array.length == 30) {
			this.motion_array = this.motion_array.slice(1);
		}
		this.motion_array.push(acceleration.z);

		console.log(this.motion_array.length);

		this.motion_array.forEach((value, index) => {
			if(value < 0) {
				console.log(value);
				return true;
			}
		});

		return false;
	}



}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}