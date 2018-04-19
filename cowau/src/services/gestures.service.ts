import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public isFlipItGesture(timeForGesture:number = 1500, frequency:number = 50) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: frequency
		}

		let arraySize = timeForGesture / motionOpts.frequency;

		let motionArray:Array<number> = new Array<number>();
		
		this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			let flipDown:boolean = false;
			let startTop:boolean = false;

			if(motionArray.length == arraySize) {
				motionArray = motionArray.slice(1);
			}
			
			motionArray.push(acceleration.z);

			if(motionArray[0] > 8) {
				startTop = true;
			}
			
			motionArray.forEach((value, index) => {
				if(value < -8) {
					flipDown = true;
				}

				if(value > 8 && flipDown && startTop) {
					flipDown = false;
					this.events.publish('flipped', acceleration);
					motionArray = new Array<number>();
				}
				
			});
		});
	}

	public stopFlipitWatch(ev:Events) {
		ev.unsubscribe('flipped');
		this.devMotionSubscription.unsubscribe();
	}
}

function roundFloat(num:number, precision:number) {
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}