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
					this.sendEvent('flipped', value);
					this.flipArray = new Array<number>();
				}
			});
		});
	}

	private throwItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		if(this.throwArray.length == arraySize) {
			this.throwArray = this.throwArray.slice(1);
		}

		this.throwArray.push(acceleration.x);

		let startIndex = -1;
		let startDir = '';
		let endFor = false;

		this.throwArray.forEach((value, index) => {
			if(!endFor) {
				if(value > 25) {
					startDir = 'positive';
					startIndex = index;
					endFor = true;
				}

				if(value < -25) {
					startDir = 'negative';
					startIndex = index;
					endFor = true;
				}
			}
		});

		if(startDir != '' && startIndex != -1) {
			for(let i=startIndex; i<this.throwArray.length; i++) {
				if(startDir == 'positive') {
					if(this.throwArray[i] < -35) {
						console.log(this.throwArray[i]);
						console.log('throw gesture');
						startDir = '';
						startIndex = -1;
						this.sendEvent('thrown', this.throwArray[i]);
						this.throwArray = new Array<any>();
						this.flipArray = new Array<any>();
					}
				}
				if(startDir == 'negative') {
					if(this.throwArray[i] > 35) {
						console.log(this.throwArray[i]);
						console.log('throw gesture');
						startDir = '';
						startIndex = -1;
						this.sendEvent('thrown', this.throwArray[i]);
						this.throwArray = new Array<any>();
						this.flipArray = new Array<any>();
					}
				}
			}
		}
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

	private sendEvent(name:string, value:any) {
		this.events.publish(name, value);
	}
}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}