import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;
	gyroSubscription:any;

	flipArray:Array<any> = new Array<any>();
	throwArray:Array<any> = new Array<any>();
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public watchForGesture(watchForThrow:boolean = true, timeForGesture:number = 1500, frequency:number = 50) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: frequency
		}

		let arraySize = timeForGesture / motionOpts.frequency;

		this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			this.isFlipItGesture(arraySize, acceleration);

			if(watchForThrow) {
				this.throwItGesture(arraySize, acceleration);
			}
		});
	}

	private isFlipItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		let flipDown:boolean = false;
		let flipUp:boolean = false;
		let flipGyroDown:boolean = false;
		let flipGyroUp:boolean = false;


		if(this.flipArray.length == arraySize) {
			this.flipArray = this.flipArray.slice(1);
		}

		this.gyro.getCurrent().then((orientation:GyroscopeOrientation) => {
			this.flipArray.push({devmo_z: acceleration.z, gyro_y: orientation.y});

			this.flipArray.forEach((value, index) => {
				if(value.devmo_z < -8) {
					flipDown = true;
				}

				if(value.devmo_z > 8) {
					flipUp = true;
				}

				if(value.gyro_y > 4) {
					flipGyroUp = true;
				}
				if (value.gyro_y < -4){
					flipGyroDown = true;
				}


				if(flipDown && flipUp && flipGyroUp && flipGyroDown) {
					flipDown = flipUp = flipGyroUp = flipGyroDown = false;
					this.events.publish('flipped', value);
					this.flipArray = new Array<number>();
				}
			});
		});
	}

	private throwItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		console.log('check for throwing');
	}

	public stopGestureWatch(ev:Events, name:string|Array<string>) {
		if(typeof(name) === "string") {
			ev.unsubscribe(name);
		} else {
			name.forEach((value) => {
				ev.unsubscribe(value);
			});
		}
		this.devMotionSubscription.unsubscribe();
	}
}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}