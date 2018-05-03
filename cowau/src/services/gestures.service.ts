import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;
	gyroSubscription:any;

	acMedianXarray:Array<number> = new Array<number>();
	acMedianYarray:Array<number> = new Array<number>();
	acMedianZarray:Array<number> = new Array<number>();

	acMedianX:number = 0;
	acMedianY:number = 2;
	acMedianZ:number = 9.81;

	countAccelerationData:number = 0;

	flipArray:Array<any> = new Array<any>();
	throwArray:Array<any> = new Array<any>();

	stillStandingTreshold:number = 1;
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public watchForGesture(watchForThrow:boolean = true, timeForGesture:number = 1500, frequency:number = 50) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: frequency
		}

		let arraySize = timeForGesture / motionOpts.frequency;

		this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			this.getAccelerationMerianXYZ(acceleration, arraySize);

			this.isFlipItGesture(arraySize, acceleration);

			if(watchForThrow) {
				this.throwItGesture(arraySize, acceleration);
			}
			
			this.countAccelerationData++;
		});
	}

	private isFlipItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		let flipDown:boolean = false;
		let flipUp:boolean = false;
		let flipGyroDown:boolean = false;
		let flipGyroUp:boolean = false;
		let checkFlip:boolean = false;

		if(this.flipArray.length == arraySize) {
			this.flipArray = this.flipArray.slice(1);
		}

		// console.log('MEDIAN Z: ' + this.acMedianZ);

		this.gyro.getCurrent().then((orientation:GyroscopeOrientation) => {
			this.flipArray[this.countAccelerationData] = {devmo: acceleration, gyro: orientation};

			if(acceleration.z < (this.acMedianZ - this.stillStandingTreshold) || acceleration.z > (this.acMedianZ + this.stillStandingTreshold)) {
				this.flipArray.forEach((value, index) => {
					//check acceleration state
					if(value.devmo.z < -4) {
						flipDown = true;
					}
					if(value.devmo.z > 8) {
						flipUp = true;
					}

					//check gyro state
					if(value.gyro.y > 4) {
						flipGyroUp = true;
					}
					if(value.gyro.y < -4){
						flipGyroDown = true;
					}
					
					//controll check
					if(value.devmo.y <= (this.acMedianY + this.stillStandingTreshold) && value.devmo.y >= (this.acMedianY - this.stillStandingTreshold)
						&& value.devmo.x <= (this.acMedianX + this.stillStandingTreshold) && value.devmo.x >= (this.acMedianX - this.stillStandingTreshold)) {
						checkFlip = true;
					}

					if(flipDown && flipUp && flipGyroUp && flipGyroDown && checkFlip) {
						flipDown = flipUp = flipGyroUp = flipGyroDown = false;
						checkFlip = false;
						this.sendEvent('flipped', value);
						this.flipArray = new Array<number>();
						this.countAccelerationData = 0;
					}
				});
			}
		});
	}

	private throwItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		if(this.throwArray.length == arraySize) {
			this.throwArray = this.throwArray.slice(1);
		}

		this.throwArray[this.countAccelerationData] = acceleration.x;

		let startIndex = -1;
		let startDir = '';
		let endFor = false;

		this.throwArray.forEach((value, index) => {
			if(!endFor) {
				if(value > 15) {
					startDir = 'positive';
					startIndex = index;
					endFor = true;
				}
				if(value < -15) {
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
						this.flipArray = new Array<number>();

						this.countAccelerationData = 0;
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
						this.flipArray = new Array<number>();

						this.countAccelerationData = 0;
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

	private getAccelerationMerianXYZ(acceleration:DeviceAcceleration, arraySize:number) {
		if(this.acMedianXarray.length == arraySize) {
			this.acMedianX = medianOfArray(this.acMedianXarray);
			this.acMedianY = medianOfArray(this.acMedianYarray);
			this.acMedianZ = medianOfArray(this.acMedianZarray);

			this.acMedianXarray = this.acMedianXarray.slice(1);
			this.acMedianYarray = this.acMedianYarray.slice(1);
			this.acMedianZarray = this.acMedianZarray.slice(1);

			this.countAccelerationData = 0;
		}

		this.acMedianXarray[this.countAccelerationData] = acceleration.x;
		this.acMedianYarray[this.countAccelerationData] = acceleration.y;
		this.acMedianZarray[this.countAccelerationData] = acceleration.z;
	}
}

function medianOfArray(values:Array<number>):number {
	let median:number;
	let sortedArray:Array<number>;

	sortedArray = values.sort();

	//even or odd amount of values
	if(sortedArray.length % 2 == 0) {
		let halfAmount = sortedArray.length / 2;
		median = 0.5 * (sortedArray[halfAmount] + sortedArray[(halfAmount + 1)]);
	} else {
		median = sortedArray[((sortedArray.length + 1) / 2)];
	}

	return median;
}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}