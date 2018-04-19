import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

//ionic native imports
import { Gyroscope, GyroscopeOptions, GyroscopeOrientation } from '@ionic-native/gyroscope';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';


@Injectable()
export class GesturesService {
	devMotionSubscription:any;
	gyroSubscription:any;
	
	constructor(public devMotion:DeviceMotion, public gyro:Gyroscope, public platform:Platform, public events:Events) {}

	public isFlipItGesture(timeForGesture:number = 1500, frequency:number = 50) {
		let motionOpts:DeviceMotionAccelerometerOptions = {
			frequency: frequency
		}

		let arraySize = timeForGesture / motionOpts.frequency;

		let motionArray:Array<number> = new Array<number>();
		let gyroArray:Array<number> = new Array<number>();

		let flipArray:Array<any> = new Array<any>();

		let gyroCheck:boolean = false;
		
		this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe((acceleration:DeviceMotionAccelerationData) => {
			let flipDown:boolean = false;
			let flipUp:boolean = false;
			let gyroDown:boolean = false;
			let gyroUp:boolean = false;


			if(flipArray.length == arraySize) {
				flipArray = flipArray.slice(1);
			}

			this.gyro.getCurrent().then((orientation) => {
				flipArray.push({devmo_z: acceleration.z, gyro_y: orientation.y});

				flipArray.forEach((value, index) => {
					if(value.devmo_z < -8) {
						flipDown = true;
					}

					if(value.devmo_z > 8) {
						flipUp = true;
					}

					if(value.gyro_y > 4) {
						gyroUp = true;
					}
					if (value.gyro_y < -4){
						gyroDown = true;
					}

					if(flipDown && flipUp && gyroUp && gyroDown) {
						flipDown = flipUp = gyroUp = gyroDown = false;
						this.events.publish('flipped', acceleration);
						flipArray = new Array<number>();
					}
				});
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