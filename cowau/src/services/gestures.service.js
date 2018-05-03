var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
//ionic native imports
import { Gyroscope } from '@ionic-native/gyroscope';
import { DeviceMotion } from '@ionic-native/device-motion';
var GesturesService = /** @class */ (function () {
    function GesturesService(devMotion, gyro, platform, events) {
        this.devMotion = devMotion;
        this.gyro = gyro;
        this.platform = platform;
        this.events = events;
        this.acMedianXarray = new Array();
        this.acMedianYarray = new Array();
        this.acMedianZarray = new Array();
        this.acMedianX = 0;
        this.acMedianY = 2;
        this.acMedianZ = 9.81;
        this.countAccelerationData = 0;
        this.flipArray = new Array();
        this.throwArray = new Array();
        this.stillStandingTreshold = 1;
    }
    GesturesService.prototype.watchForGesture = function (watchForEvents, timeForGesture, frequency) {
        var _this = this;
        if (timeForGesture === void 0) { timeForGesture = 1500; }
        if (frequency === void 0) { frequency = 50; }
        var motionOpts = {
            frequency: frequency
        };
        var arraySize = timeForGesture / motionOpts.frequency;
        this.devMotionSubscription = this.devMotion.watchAcceleration(motionOpts).subscribe(function (acceleration) {
            _this.getAccelerationMerianXYZ(acceleration, arraySize);
            if (watchForEvents.indexOf('idle_out')) {
                _this.isIdleMode(arraySize, acceleration);
            }
            if (watchForEvents.indexOf('flipped')) {
                _this.isFlipItGesture(arraySize, acceleration);
            }
            if (watchForEvents.indexOf('thrown') != -1) {
                _this.throwItGesture(arraySize, acceleration);
            }
            if (watchForEvents.indexOf('idle_out')) {
                _this.noIdleMode(arraySize, acceleration);
            }
            _this.countAccelerationData++;
        });
    };
    GesturesService.prototype.isIdleMode = function (arraySize, acceleration) {
        console.log(JSON.stringify(acceleration));
    };
    GesturesService.prototype.isFlipItGesture = function (arraySize, acceleration) {
        var _this = this;
        var flipDown = false;
        var flipUp = false;
        var flipGyroDown = false;
        var flipGyroUp = false;
        var checkFlip = false;
        if (this.flipArray.length == arraySize) {
            this.flipArray = this.flipArray.slice(1);
        }
        this.gyro.getCurrent().then(function (orientation) {
            _this.flipArray[_this.countAccelerationData] = { devmo: acceleration, gyro: orientation };
            if (acceleration.z < (_this.acMedianZ - _this.stillStandingTreshold) || acceleration.z > (_this.acMedianZ + _this.stillStandingTreshold)) {
                _this.flipArray.forEach(function (value, index) {
                    //check acceleration state
                    if (value.devmo.z < -8) {
                        flipDown = true;
                    }
                    if (value.devmo.z > 8) {
                        flipUp = true;
                    }
                    //check gyro state
                    if (value.gyro.y > 4) {
                        flipGyroUp = true;
                    }
                    if (value.gyro.y < -4) {
                        flipGyroDown = true;
                    }
                    //controll check
                    if (value.devmo.y <= (_this.acMedianY + _this.stillStandingTreshold) && value.devmo.y >= (_this.acMedianY - _this.stillStandingTreshold)
                        && value.devmo.x <= (_this.acMedianX + _this.stillStandingTreshold) && value.devmo.x >= (_this.acMedianX - _this.stillStandingTreshold)) {
                        checkFlip = true;
                    }
                    if (flipDown && flipUp && flipGyroUp && flipGyroDown && checkFlip) {
                        flipDown = flipUp = flipGyroUp = flipGyroDown = false;
                        checkFlip = false;
                        _this.sendEvent('flipped', value);
                        _this.flipArray = new Array();
                        _this.countAccelerationData = 0;
                    }
                });
            }
        });
    };
    GesturesService.prototype.throwItGesture = function (arraySize, acceleration) {
        if (this.throwArray.length == arraySize) {
            this.throwArray = this.throwArray.slice(1);
        }
        this.throwArray[this.countAccelerationData] = acceleration.x;
        var startIndex = -1;
        var startDir = '';
        var endFor = false;
        this.throwArray.forEach(function (value, index) {
            if (!endFor) {
                if (value > 15) {
                    startDir = 'positive';
                    startIndex = index;
                    endFor = true;
                }
                if (value < -15) {
                    startDir = 'negative';
                    startIndex = index;
                    endFor = true;
                }
            }
        });
        if (startDir != '' && startIndex != -1) {
            for (var i = startIndex; i < this.throwArray.length; i++) {
                if (startDir == 'positive') {
                    if (this.throwArray[i] < -35) {
                        console.log(this.throwArray[i]);
                        console.log('throw gesture');
                        startDir = '';
                        startIndex = -1;
                        this.sendEvent('thrown', this.throwArray[i]);
                        this.throwArray = new Array();
                        this.flipArray = new Array();
                        this.countAccelerationData = 0;
                    }
                }
                if (startDir == 'negative') {
                    if (this.throwArray[i] > 35) {
                        console.log(this.throwArray[i]);
                        console.log('throw gesture');
                        startDir = '';
                        startIndex = -1;
                        this.sendEvent('thrown', this.throwArray[i]);
                        this.throwArray = new Array();
                        this.flipArray = new Array();
                        this.countAccelerationData = 0;
                    }
                }
            }
        }
    };
    GesturesService.prototype.noIdleMode = function (arraySize, acceleration) {
        console.log('go out of Idel');
    };
    GesturesService.prototype.stopGestureWatch = function (ev, name) {
        if (typeof (name) === "string") {
            ev.unsubscribe(name);
        }
        else {
            name.forEach(function (value) {
                ev.unsubscribe(value);
            });
        }
        this.devMotionSubscription.unsubscribe();
    };
    GesturesService.prototype.sendEvent = function (name, value) {
        this.events.publish(name, value);
    };
    GesturesService.prototype.getAccelerationMerianXYZ = function (acceleration, arraySize) {
        if (this.acMedianXarray.length == arraySize) {
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
    };
    GesturesService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [DeviceMotion, Gyroscope, Platform, Events])
    ], GesturesService);
    return GesturesService;
}());
export { GesturesService };
function medianOfArray(values) {
    var median;
    var sortedArray;
    sortedArray = values.sort();
    //even or odd amount of values
    if (sortedArray.length % 2 == 0) {
        var halfAmount = sortedArray.length / 2;
        median = 0.5 * (sortedArray[halfAmount] + sortedArray[(halfAmount + 1)]);
    }
    else {
        median = sortedArray[((sortedArray.length + 1) / 2)];
    }
    return median;
}
function roundFloat(num, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}
//# sourceMappingURL=gestures.service.js.map