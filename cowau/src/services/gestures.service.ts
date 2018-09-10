import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';
import { Vibration } from '@ionic-native/vibration';

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
	// countAccelerationDataForFlip:number = 0;
	countAccelerationDataForIdle:number = 0;
	countAccelerationDataForNoMoreIdle:number = 0;
	countAccelerationDataForMedian:number = 0;

	// flipArray:Array<any> = new Array<any>();
	throwArray:Array<any> = new Array<any>();
	goToIdleArray:Array<any> = new Array<any>();
	outOfIdleArray:Array<any> = new Array<any>();

	throwTimeout:boolean = false;
	// flipTimeout:boolean = false;
	idleOutTimeout:boolean = false;
	idleInTimeout:boolean = false;

	stillStandingTreshold:number = 10;

	watchForEvents:Array<GestureType> = new Array<GestureType>();
	timeForGesture:number = 1500;
	frequency:number = 50;
	
	constructor(public devMotion:DeviceMotion, public platform:Platform, public events:Events, public vibration:Vibration) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: this.frequency
		}

		let arraySize = this.timeForGesture / motionOpts.frequency;

		let timeTillIdle = 5000; //later 10000
		let arraySizeIdle = timeTillIdle / motionOpts.frequency;

		let timeOutOfIdle = 500;
		let arraySizeIdleOut = timeOutOfIdle / motionOpts.frequency;
		
		platform.ready().then((readySource) => {
			if(readySource == 'cordova' || readySource == 'mobile') {
				this.countAccelerationDataForIdle = 0;
				this.countAccelerationDataForMedian = 0;
				this.countAccelerationDataForThrow = 0;
				// this.countAccelerationDataForFlip = 0;
				this.countAccelerationDataForNoMoreIdle = 0;

				this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
					if(acceleration) {
						this.getAccelerationMedianXYZ(acceleration, 15);
						
						if(this.watchForEvents.indexOf(GestureType.IDLE_OUT) != -1 && !this.idleOutTimeout) {
							this.noIdleMode(arraySizeIdleOut, acceleration);
						}

						// if(this.watchForEvents.indexOf(GestureType.FLIPPED) != -1 && !this.flipTimeout) {
						// 	this.isFlipItGesture(arraySize, acceleration);
						// }

						if(this.watchForEvents.indexOf(GestureType.THROWN) != -1 && !this.throwTimeout) {
							this.throwItGesture(arraySize, acceleration);
						}

						if(this.watchForEvents.indexOf(GestureType.IDLE_IN) != -1 && !this.idleInTimeout) {
							this.isIdleMode(arraySizeIdle, acceleration);
						}
					}
					
				});
			}
		})
	}

	public watchForGesture(watchForEvents:Array<GestureType>, timeForGesture:number = 1000, frequency:number = 50) {
		this.watchForEvents = watchForEvents
		this.timeForGesture = timeForGesture;
		this.frequency = frequency;
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
			console.log('IDLE_OUT');
			this.startIdleOutTimer();
			outOfIdle = false;
		}
	}

	// private isFlipItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
	// 	if(this.countAccelerationDataForFlip == (arraySize-1)) {
	// 		this.countAccelerationDataForFlip = 0;
	// 	} else {
	// 		if(this.flipArray[0]) {
	// 			this.countAccelerationDataForFlip++;
	// 		}
	// 	}

	// 	let flipDown:boolean = false;
	// 	let flipUp:boolean = false;
	// 	let dCheckFlipDown:boolean = true;
	// 	let dCheckFlipUp:boolean = true;

	// 	let stopForDown = false;
	// 	let stopForUp = false;

	// 	let startPosUp = -1;

	// 	this.flipArray[this.countAccelerationDataForFlip] = {devmo: acceleration};

	// 	if(acceleration.z < (this.acMedianZ - this.stillStandingTreshold) || acceleration.z > (this.acMedianZ + this.stillStandingTreshold)) {
	// 		for(let i=0; i<this.flipArray.length; i++) {

	// 			if(!stopForDown) {
	// 				//check acceleration state
	// 				if(this.flipArray[i].devmo.z < -6) {
	// 					// console.log('first? ' + this.flipArray[i].devmo.z);
	// 					flipDown = true;
	// 					startPosUp = i;
	// 					stopForDown = true;
	// 				}
	// 				//controll check
	// 				if(this.flipArray[i].devmo.y > (this.acMedianY + this.stillStandingTreshold) || this.flipArray[i].devmo.y < (this.acMedianY - this.stillStandingTreshold)) {
	// 					dCheckFlipDown = false;
	// 				}
	// 			}
				
	// 		}

	// 		if(startPosUp > -1 && flipDown) {
	// 			for(let i = startPosUp; i<this.flipArray.length; i++) {
	// 				if(!stopForUp) {
	// 					if(this.flipArray[i].devmo.z > 7.5) {
	// 						// console.log('second? ' + this.flipArray[i].devmo.z);
	// 						stopForUp = true;
	// 						flipUp = true;
	// 					}

	// 					if(this.flipArray[i].devmo.y > (this.acMedianY + this.stillStandingTreshold) || this.flipArray[i].devmo.y < (this.acMedianY - this.stillStandingTreshold)) {
	// 						dCheckFlipUp = false;
	// 					}

	// 				}
	// 			}
				
	// 			if(stopForUp && flipDown && flipUp && dCheckFlipUp) {		
	// 				flipDown = flipUp = false;
	// 				dCheckFlipDown = dCheckFlipUp = true;
	// 				startPosUp = -1;
	// 				this.sendEvent(GestureType.FLIPPED, acceleration);
	// 				this.vibration.vibrate(300);
	// 				this.startFlipTimer();
	// 				console.log('FLIPPED');
	// 			} else {
	// 				flipDown = flipUp = false;
	// 				dCheckFlipDown = dCheckFlipUp = true;
	// 				startPosUp = -1;
	// 				this.countAccelerationDataForFlip = 0;
	// 				this.flipArray = new Array<any>();
	// 			}
	// 		}
	// 	}
	// }

	private throwItGesture(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		if(this.countAccelerationDataForThrow == (arraySize-1)) {
			this.countAccelerationDataForThrow = 0;
		} else {
			if(this.throwArray[0]) {
				this.countAccelerationDataForThrow++;
			}
		}

		this.throwArray[this.countAccelerationDataForThrow] = { acce: acceleration };

		if(this.throwArray.length > 0) {
			let startIndex = -1;

			let backAccRight = false;
			let backAccLeft = false;

			let endFor = false;
			let endForRotate = false;
			let endLastFor = false;

			for(let i=0; i<this.throwArray.length; i++) {
				if(!endFor && this.throwArray[i] != null) {
						if(this.throwArray[i].acce.x > 15) {
							startIndex = i;
							backAccRight = true;
							endFor = true;
						}
					
						if(this.throwArray[i].acce.x < -15) {
							startIndex = i;
							backAccLeft = true;
							endFor = true;
						}
				}
			}

			if(startIndex != -1) {
				for(let i=startIndex; i<this.throwArray.length; i++) {
					if(!endLastFor && this.throwArray[i] != null) {
						if(backAccRight && this.throwArray[i].acce.x < -30) {
							this.sendEvent(GestureType.THROWN, this.throwArray[i]);
							console.log('THROWN RIGHT');
							this.startThrowTimer(1000);
							
							startIndex = -1;
							backAccRight = false;
							backAccLeft = false;

							endLastFor = true;
						} else if(backAccLeft && this.throwArray[i].acce.x > 30) {
							console.log('THROWN LEFT');
							this.sendEvent(GestureType.THROWN, this.throwArray[i]);
							this.startThrowTimer(1000);
							
							startIndex = -1;
							backAccRight = false;
							backAccLeft = false;

							endLastFor = true;
						}
					}
				}
			}
		}
	}

	private isIdleMode(arraySize:number, acceleration:DeviceMotionAccelerationData) {
		//treshold X stillstanding: +-0.03 
		//treshold Y stillstanding: +-0.07
		//treshold Z stillstanding: +-0.08

		let xTreshold = 0.03;
		let yTreshold = 0.07;
		let zTreshold = 0.08;

		let toIdle:boolean = true;

		if(this.countAccelerationDataForIdle == (arraySize-1)) {
			this.countAccelerationDataForIdle = 0;
		} else {
			this.countAccelerationDataForIdle++;
		}

		this.goToIdleArray[this.countAccelerationDataForIdle] = acceleration;

		if(this.goToIdleArray.length == arraySize) {
			this.goToIdleArray.forEach((acc, index) => {

				if(	acc.x < (this.acMedianX - xTreshold) || acc.x > (this.acMedianX + xTreshold) ||
					acc.y < (this.acMedianY - yTreshold) || acc.y > (this.acMedianY + yTreshold) ||
					acc.z < (this.acMedianZ - zTreshold) || acc.z > (this.acMedianZ + zTreshold)) {
					toIdle = false;
				}
			});
 
			if(toIdle) {
				this.sendEvent(GestureType.IDLE_IN, acceleration);
				this.startIdleInTimer();
				console.log('IDLE_IN');
				toIdle = true;
			}
		}
		
	}

	public stopGestureWatch(ev:Events, name:GestureType) {
		ev.unsubscribe(name.toString());
	}

	private sendEvent(name:GestureType, value:any) {
		this.events.publish(name.toString(), value);
		this.resetAllArraysAndCountersForEvents();
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

	private resetAllArraysAndCountersForEvents() {
		this.countAccelerationDataForThrow = 0;
		// this.countAccelerationDataForFlip = 0;
		this.countAccelerationDataForNoMoreIdle= 0;
		// this.flipArray = new Array<any>();
		this.throwArray = new Array<any>();
		this.outOfIdleArray = new Array<any>();
	}

	private startThrowTimer(time:number = 2500) {
		this.throwTimeout = true;
	    setTimeout(() => {
	    	this.throwTimeout = false;
	    }, time);
	}

	// private startFlipTimer(time:number = 200) {
	// 	this.flipTimeout = true;
	//     setTimeout(() => {
	//     	this.flipTimeout = false;
	//     }, time);
	// }

	private startIdleOutTimer(time:number = 2500) {
		this.idleOutTimeout = true;
	    setTimeout(() => {
	    	this.idleOutTimeout = false;
	    }, time);
	}

	private startIdleInTimer(time:number = 2500) {
		this.idleInTimeout = true;
		setTimeout(() => {
			this.idleInTimeout = false;
		}, time);
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