import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';

//classes
import { GestureType } from '../classes/gesture-type';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;

	acMedianXarray:Array<number> = new Array<number>();
	acMedianYarray:Array<number> = new Array<number>();
	acMedianZarray:Array<number> = new Array<number>();

	acMedianX:number = 0;
	acMedianY:number = 2;
	acMedianZ:number = 9.81;

	countAccelerationDataForThrow:number = 0;
	countAccelerationDataForFlip:number = 0;
	countAccelerationDataForIdle:number = 0;
	countAccelerationDataForMedian:number = 0;
	countAccelerationDataForNoMoreIdle:number = 0;

	flipArray:Array<any> = new Array<any>();
	throwArray:Array<any> = new Array<any>();
	goToIdleArray:Array<any> = new Array<any>();
	outOfIdleArray:Array<any> = new Array<any>();

	throwTimeout:boolean = false;
	idleOutTimeout:boolean = false;

	stillStandingTreshold:number = 3;
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public watchForGesture(watchForEvents:Array<GestureType>, timeForGesture:number = 1500, frequency:number = 50) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: frequency
		}

		let arraySize = timeForGesture / motionOpts.frequency;

		let timeTillIdle = 3000; //later 10000
		let arraySizeIdle = timeTillIdle / motionOpts.frequency;

		let timeOutOfIdle = 500;
		let arraySizeIdleOut = timeOutOfIdle / motionOpts.frequency;

		this.countAccelerationDataForIdle = 0;
		this.countAccelerationDataForMedian = 0;
		this.countAccelerationDataForThrow = 0;
		this.countAccelerationDataForFlip = 0;
		this.countAccelerationDataForNoMoreIdle = 0;

		this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			this.getAccelerationMedianXYZ(acceleration, arraySize);
			
			if(watchForEvents.indexOf(GestureType.IDLE_OUT) != -1) {
				this.noIdleMode(arraySizeIdleOut, acceleration);
			}

			if(watchForEvents.indexOf(GestureType.FLIPPED) != -1) {
				this.isFlipItGesture(arraySize, acceleration);
			}

			if(watchForEvents.indexOf(GestureType.THROWN) != -1) {
				this.throwItGesture(arraySize, acceleration);
			}

			if(watchForEvents.indexOf(GestureType.IDLE_IN) != -1) {
				this.isIdleMode(arraySizeIdle, acceleration);
			}
			
		});
	}

	private noIdleMode(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		let xTreshold = 1;
		let yTreshold = 3;
		let zTreshold = 3;

		let outOfIdle:boolean = false;

		if(	acceleration.x < (this.acMedianX - xTreshold) || acceleration.x > (this.acMedianX + xTreshold) ||
			acceleration.y < (this.acMedianY - yTreshold) || acceleration.y > (this.acMedianY + yTreshold) ||
			acceleration.z < (this.acMedianZ - zTreshold) || acceleration.z > (this.acMedianZ + zTreshold)) {
			outOfIdle = true;
		}

		if(outOfIdle) {
			this.sendEvent(GestureType.IDLE_OUT, acceleration);
			this.startIdleOutTimer();
			outOfIdle = false;
		}
	}

	private isFlipItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		if(this.countAccelerationDataForFlip == (arraySize-1)) {
			this.countAccelerationDataForFlip = 0;
		} else {
			this.countAccelerationDataForFlip++;
		}

		let flipDown:boolean = false;
		let flipUp:boolean = false;
		let flipGyroDown:boolean = false;
		let flipGyroUp:boolean = false;
		let checkFlip:boolean = true;

		this.gyro.getCurrent().then((orientation:GyroscopeOrientation) => {
			this.flipArray[this.countAccelerationDataForFlip] = {devmo: acceleration, gyro: orientation};

			if(acceleration.z < (this.acMedianZ - this.stillStandingTreshold) || acceleration.z > (this.acMedianZ + this.stillStandingTreshold)) {
				this.flipArray.forEach((value, index) => {
					//check acceleration state
					if(value.devmo.z < -8) {
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
					if(value.devmo.y > (this.acMedianY + this.stillStandingTreshold) || value.devmo.y < (this.acMedianY - this.stillStandingTreshold)) {
						// console.log(value.devmo.y, this.acMedianY);
						checkFlip = false;
					}
				});

				if(flipDown && flipUp && flipGyroUp && flipGyroDown && checkFlip && !this.idleOutTimeout) {
					flipDown = flipUp = flipGyroDown = flipGyroUp = false;
					this.sendEvent(GestureType.FLIPPED, acceleration);
					this.flipArray = new Array<number>();
					this.countAccelerationDataForFlip = 0;
				}
			}
		});
	}

	private throwItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		if(this.countAccelerationDataForThrow == (arraySize-1)) {
			this.countAccelerationDataForThrow = 0;
		} else {
			this.countAccelerationDataForThrow++;
		}

		this.gyro.getCurrent().then((orientation:GyroscopeOrientation) => {
			this.throwArray[this.countAccelerationDataForThrow] = { 'acc': acceleration, 'gyro': orientation };
		});

		let startIndex = -1;
		let startDir = '';
		let gyroRightRotate = false;
		let gyroLeftRotate = false;
		let endFor = false;


		this.throwArray.forEach((value, index) => {
			if(value.gyro.y < -4) {
				gyroRightRotate = true;
			}
			if(value.gyro.y > 4) {
				gyroLeftRotate = true;
			}
			if(!endFor) {
				if(value.acc.x > 15) {
					startDir = 'positive';
					startIndex = index;
					endFor = true;
				}
				if(value.acc.x < -15) {
					startDir = 'negative';
					startIndex = index;
					endFor = true;
				}
			}
		});

		if(startDir != '' && startIndex != -1 && this.throwArray.length > 0 && !this.throwTimeout) {
			for(let i=startIndex; i<this.throwArray.length; i++) {
				if(startDir == 'positive' && gyroRightRotate) {
					if(this.throwArray[i].acc.x < -25) {
						console.log('throw gesture right hand');
						startDir = '';
						startIndex = -1;
						gyroRightRotate = false;
						gyroLeftRotate = false;
						this.sendEvent(GestureType.THROWN, this.throwArray[i]);
						this.startThrowTimer();
						this.throwArray = new Array<any>();
						this.flipArray = new Array<number>();

						this.countAccelerationDataForThrow = 0;
					}
				} else if(startDir == 'negative' && gyroLeftRotate) {
					if(this.throwArray[i].acc.x > 25) {
						console.log('throw gesture left hand');
						startDir = '';
						startIndex = -1;
						gyroRightRotate = false;
						gyroLeftRotate = false;
						this.sendEvent(GestureType.THROWN, this.throwArray[i]);
						this.startThrowTimer();
						this.throwArray = new Array<any>();
						this.flipArray = new Array<number>();

						this.countAccelerationDataForThrow = 0;
					}
				}
			}
		}
	}

	private isIdleMode(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		//treshold X stillstanding: +-0.03 
		//treshold Y stillstanding: +-0.07
		//treshold Z stillstanding: +-0.08

		let xTreshold = 0.05;
		let yTreshold = 0.05;
		let zTreshold = 0.05;

		let toIdle:boolean = true;

		if(this.countAccelerationDataForIdle == (arraySize-1)) {
			this.countAccelerationDataForIdle = 0;
		} else {
			this.countAccelerationDataForIdle++;
		}

		this.goToIdleArray[this.countAccelerationDataForIdle] = acceleration;

		if(this.goToIdleArray.length == arraySize) {
			this.goToIdleArray.forEach((acc, index) => {
				// console.log(acc.x, this.acMedianX);
				// console.log(index, acc.y, this.acMedianY);
				// console.log(acc.z, this.acMedianZ);

				if(	acc.x < (this.acMedianX - xTreshold) || acc.x > (this.acMedianX + xTreshold) ||
					acc.y < (this.acMedianY - yTreshold) || acc.y > (this.acMedianY + yTreshold) ||
					acc.z < (this.acMedianZ - zTreshold) || acc.z > (this.acMedianZ + zTreshold)) {
					toIdle = false;
				}
			});
 
			if(toIdle) {
				this.sendEvent(GestureType.IDLE_IN, acceleration);
				this.countAccelerationDataForIdle = 0;
				toIdle = true;
			}
		}
		
	}

	public stopGestureWatch(ev:Events, name:GestureType) {
		ev.unsubscribe(name.toString());
		this.devMotionSubscription.unsubscribe();
	}

	private sendEvent(name:GestureType, value:any) {
		this.events.publish(name.toString(), value);
	}

	private getAccelerationMedianXYZ(acceleration:DeviceAcceleration, arraySize:number) {
		this.acMedianXarray[this.countAccelerationDataForMedian] = acceleration.x;
		this.acMedianYarray[this.countAccelerationDataForMedian] = acceleration.y;
		this.acMedianZarray[this.countAccelerationDataForMedian] = acceleration.z;

		if(this.countAccelerationDataForMedian == (arraySize - 1)) {
			this.countAccelerationDataForMedian = 0;
		} else {
			this.countAccelerationDataForMedian++;
		}
		
		if(this.acMedianXarray.length == arraySize) {
			this.acMedianX = medianOfArray(this.acMedianXarray);
			this.acMedianY = medianOfArray(this.acMedianYarray);
			this.acMedianZ = medianOfArray(this.acMedianZarray);
		}

	}

	private startThrowTimer() {
		this.throwTimeout = true;
		console.log(this.throwTimeout);
	    setTimeout(() => {
	    	this.throwTimeout = false;
	    	console.log(this.throwTimeout);
	    }, 2000);
	}

	private startIdleOutTimer() {
		this.idleOutTimeout = true;
		console.log(this.idleOutTimeout);
	    setTimeout(() => {
	    	this.idleOutTimeout = false;
	    	console.log(this.idleOutTimeout);
	    }, 2000);
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

// function roundFloat(num:number, precision:number) {
// 	var factor = Math.pow(10, precision);
// 	return Math.round(num * factor) / factor;
// }