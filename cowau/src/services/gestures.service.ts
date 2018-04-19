import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public isFlipItGesture() {
		let motion_opts:DeviceMotionAccelerometerOptions = {
			frequency: 50
		}

		let time_for_gesture:number = 30;

		let motion_array:Array<number> = new Array<number>();
		
		this.devMotionSubscription = this.devMotion.watchAcceleration(motion_opts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			let flip_down:boolean = false;
			let start_top:boolean = false;

			if(motion_array.length == time_for_gesture) {
				motion_array = motion_array.slice(1);
			}
			
			motion_array.push(acceleration.z);

			if(motion_array[0] > 8) {
				start_top = true;
			}
			
			motion_array.forEach((value, index) => {
				if(value < -8) {
					flip_down = true;
				}

				if(value > 8 && flip_down && start_top) {
					flip_down = false;
					this.events.publish('flipped', acceleration);
					motion_array = new Array<number>();
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