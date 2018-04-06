webpackJsonp([1],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GesturesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import { Jsonp } from '@angular/http';
var GesturesService = /** @class */ (function () {
    function GesturesService() {
    }
    GesturesService.prototype.isFlipItGesture = function () {
        return true;
    };
    GesturesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], GesturesService);
    return GesturesService;
}());

//# sourceMappingURL=gestures.service.js.map

/***/ }),

/***/ 110:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 110;

/***/ }),

/***/ 151:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 151;

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisualPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__ = __webpack_require__(100);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var VisualPage = /** @class */ (function () {
    function VisualPage(navCtrl, navParams, gestureService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.gestureService = gestureService;
        //gestureService.isFlipItGesture();
    }
    VisualPage.prototype.ionViewDidLoad = function () {
        initVisual();
    };
    VisualPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-visual',template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\visual\visual.html"*/'<canvas id="canvas" class="canvas-visual"></canvas>\n\n<div class="background-pattern"></div>\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\visual\visual.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__["a" /* GesturesService */]])
    ], VisualPage);
    return VisualPage;
}());

// ###############################################################
// ###############################################################
// Create the Visual Screen Canvas
function initVisual() {
    var cta = document.getElementById('canvas');
    cta.addEventListener('click', function () {
        setupVisualScreen();
    });
    // Define a few important var/const for the following scripts
    var cvs = document.getElementById('canvas'); // Define the Canvas Element
    var ctx = cvs.getContext('2d'); // Setup the Canvas to 2D
    var speed = 5; // Define the Speed of the Soundwaves
    var movementSpeed = 5; // Define the Speed of the Sound Elements
    var ratio = window.devicePixelRatio; // Define the DPI of the Screen
    // This are imporatent var for the Script,
    // but here you don't have to change something
    var canvasWidth = window.innerWidth; // Hight of the Canvas
    var canvasHeight = window.innerHeight; // Width of the Canvas
    var soundsArray = []; // Array of all circles
    // Create a canvas with the max size of the device
    // and create a canvas with a higher DPI as the "Max-Size"
    // so everything is sharp as fuck
    cvs.width = canvasWidth * ratio; // Multiply the width, with the DPI Scale
    cvs.height = canvasHeight * ratio; // Multiply the width, with the DPI Scal
    cvs.style.width = canvasWidth + 'px'; // Set the width in the canvas
    cvs.style.height = canvasHeight + 'px'; // Set the hight in the canvas
    canvasWidth = canvasWidth * ratio; // Set the widdth of the canvas
    canvasHeight = canvasHeight * ratio; // Set the hight of the canvas
    // ###############################################################
    // ###############################################################
    // Function to create a new Soundobject
    function Sound(x, y, radius, mass) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity = {
            x: returnRandomValue(-20, 20),
            y: returnRandomValue(-20, 20)
        };
        this.updateSound = function () {
            this.borderDetectionSound();
            this.soundDetectionSound();
            this.moveSound();
            this.drawSound();
        };
        this.borderDetectionSound = function () {
            if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
        };
        this.moveSound = function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        };
        this.drawSound = function () {
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        };
        this.soundDetectionSound = function () {
            for (var i = 0; i < soundsArray.length; i++) {
                if (this === soundsArray[i])
                    continue;
                if (getDistance(this.x, soundsArray[i].x, this.y, soundsArray[i].y) - (this.radius * 2) < 0) {
                    resolveCollision(this, soundsArray[i]);
                }
            }
        };
    }
    function setupVisualScreen() {
        var r = returnRandomValue(1, 256);
        var x = returnRandomValue(0 + r, canvasWidth - r);
        var y = returnRandomValue(0 + r, canvasHeight - r);
        var m = 20;
        for (var j = 0; j < soundsArray.length; j++) {
            if (getDistance(x, soundsArray[j].x, y, soundsArray[j].y) - (r * 2) < 0) {
                x = returnRandomValue(0 + r, canvasWidth - r);
                y = returnRandomValue(0 + r, canvasHeight - r);
                j = -1;
            }
        }
        var newSound = new Sound(x, y, r, m);
        soundsArray.push(newSound);
    }
    // Start the Canvas Animation
    draw();
    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        soundsArray.forEach(function (soundsArray) {
            soundsArray.updateSound();
        });
        requestAnimationFrame(draw);
    }
}
// ###############################################################
// ###############################################################
// Utility Functions
// Function to create a random int number
// with an min and max value
function returnRandomValue(min, max) {
    var random = Math.floor(Math.random() * (max - min + 1) + min);
    if (random === 0) {
        return random = min;
    }
    else {
        return random;
    }
}
// Function to detect distance between to objects
function getDistance(x1, x2, y1, y2) {
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function rotate(velocity, angle) {
    var rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
    return rotatedVelocities;
}
function resolveCollision(particle, otherParticle) {
    var xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    var yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;
    var xDist = otherParticle.x - particle.x;
    var yDist = otherParticle.y - particle.y;
    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        var angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        // Store mass in var for better readability in collision equation
        var m1 = particle.mass;
        var m2 = otherParticle.mass;
        // Velocity before equation
        var u1 = rotate(particle.velocity, angle);
        var u2 = rotate(otherParticle.velocity, angle);
        // Velocity after 1d collision equation
        var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
        // Final velocity after rotating axis back to original location
        var vFinal1 = rotate(v1, -angle);
        var vFinal2 = rotate(v2, -angle);
        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
//# sourceMappingURL=visual.js.map

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlipitPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the FlipitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FlipitPage = /** @class */ (function () {
    function FlipitPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    FlipitPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad FlipitPage');
    };
    FlipitPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-flipit',template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\flipit\flipit.html"*/'<div class="headline">\n  Flip It!\n</div>\n\n<div class="subline">\n  And get your sound. \n</div>\n\n<div class="video"></div>\n\n<div class="bottom-bar"></div>\n\n<div class="background-pattern-dark"></div>\n\n\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\flipit\flipit.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */]])
    ], FlipitPage);
    return FlipitPage;
}());

//# sourceMappingURL=flipit.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(219);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_flipit_flipit__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_idle_idle__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_emoji_emoji__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_server_server__ = __webpack_require__(273);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_visual_visual__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_gestures_service__ = __webpack_require__(100);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





//components






//services

var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_emoji_emoji__["a" /* EmojiPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_flipit_flipit__["a" /* FlipitPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_idle_idle__["a" /* IdlePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_server_server__["a" /* ServerPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_visual_visual__["a" /* VisualPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/flipit/flipit.module#FlipitPageModule', name: 'FlipitPage', segment: 'flipit', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_emoji_emoji__["a" /* EmojiPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_flipit_flipit__["a" /* FlipitPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_idle_idle__["a" /* IdlePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_server_server__["a" /* ServerPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_visual_visual__["a" /* VisualPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_11__services_gestures_service__["a" /* GesturesService */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_visual_visual__ = __webpack_require__(194);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_visual_visual__["a" /* VisualPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IdlePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__ = __webpack_require__(100);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var IdlePage = /** @class */ (function () {
    function IdlePage(navCtrl, navParams, gestureService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.gestureService = gestureService;
        //gestureService.isFlipItGesture();
    }
    IdlePage.prototype.ionViewDidLoad = function () {
        initCircle();
    };
    IdlePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-idle',template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\idle\idle.html"*/'<div id="call-to-action" class="call-to-aktion">\n    <div class="call-to-action-title">\n        Pick me up!\n    </div>\n</div>\n\n<canvas id="canvas" class="canvas-idle"></canvas>\n\n<div class="background-pattern"></div>\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\idle\idle.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__["a" /* GesturesService */]])
    ], IdlePage);
    return IdlePage;
}());

function initCircle() {
    // ###############################################################
    // Circle Animation Function
    // This function creates the Background Animation
    // Define a few important var/const for the following scripts
    var cvs = document.getElementById('canvas'); // Define the Canvas Element
    var ctx = cvs.getContext('2d'); // Setup the Canvas to 2D
    // const speed = 10;                                    // Define the Speed of the animaiton
    var ratio = window.devicePixelRatio; // Define the DPI of the Screen
    // This are imporatent var for the Script,
    // but here you don't have to change something
    var canvasWidth = window.innerWidth; // Hight of the Canvas
    var canvasHeight = window.innerHeight; // Width of the Canvas
    var circles = []; // Array of all circles
    // Create a canvas with the max size of the device
    // and create a canvas with a higher DPI as the "Max-Size"
    // so everything is sharp as fuck
    cvs.width = canvasWidth * ratio; // Multiply the width, with the DPI Scale
    cvs.height = canvasHeight * ratio; // Multiply the width, with the DPI Scal
    cvs.style.width = canvasWidth + 'px'; // Set the width in the canvas
    cvs.style.height = canvasHeight + 'px'; // Set the hight in the canvas
    canvasWidth = canvasWidth * ratio; // Set the widdth of the canvas
    canvasHeight = canvasHeight * ratio; // Set the hight of the canvas
    // ###############################################################
    // ###############################################################
    // Test Trigger of the Circle animaiton
    var cta = document.getElementById('call-to-action');
    cta.addEventListener('click', function () {
        setupCircles(10, canvasWidth / 2, canvasHeight / 2, (Math.random() * 5) + 4);
    });
    // ###############################################################
    // ###############################################################
    // Function to draw Circles into the Canvas
    function Circle(radius, xPos, yPos, speed) {
        this.radius = radius; // Radius of this object
        this.xPos = xPos; // x position of this object
        this.yPos = yPos; // y position of this object
        this.speed = speed; // Movementspeed of the Soundwave
        // Update the radius of the circle every frame,
        // indipendent from other Circles
        this.update = function () {
            this.radius += (this.speed * ratio); // Update the radus of this Circle
            var gradient = ctx.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.radius);
            gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
            if (this.radius >= canvasWidth && this.radius >= canvasHeight) {
                circles.splice(circles.indexOf(this), 1); // Delete old Circlces
            }
        };
    }
    // Function to create new Circles
    function setupCircles(r, x, y, s) {
        var circle = new Circle(r, x, y, s); // Create new Circle Object
        circles.push(circle); // Add Circle Object to the array
    }
    // Start the Canvas Animation
    draw();
    // Function that get triggert 60 times every second
    // so this function creaetes the animation in the background
    function draw() {
        // This line clear the canvas every Frame,
        // without this line, every circles would stay
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        for (var i = 0; i < circles.length; i++) {
            var newCircle = circles[i];
            newCircle.update();
        }
        // this line request this function every frame
        requestAnimationFrame(draw);
    }
}
//# sourceMappingURL=idle.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmojiPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the EmojiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EmojiPage = /** @class */ (function () {
    function EmojiPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    EmojiPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EmojiPage');
    };
    EmojiPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-emoji',template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\emoji\emoji.html"*/'<div class="headline">\n  Who are you?\n</div>\n\n<div class="subline">\n  Pick your Emoji. \n</div>\n\n<canvas id="canvas" class="canvas-emoji"></canvas>\n\n<div class="bottom-bar"></div>\n\n<div class="background-pattern-dark"></div>\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\emoji\emoji.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */]])
    ], EmojiPage);
    return EmojiPage;
}());

//# sourceMappingURL=emoji.js.map

/***/ }),

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_http__ = __webpack_require__(274);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ServerPage = /** @class */ (function () {
    function ServerPage(navCtrl, navParams, http) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.testMessage = "";
        setInterval(function () { _this.repeatMe(); }, 5000);
    }
    ServerPage.prototype.repeatMe = function () {
        console.log("repeat");
        this.http.get('http://192.168.0.102:8080/posts', {}, {}).then(function (data) {
            console.log(data.data);
        });
        //Observable.
    };
    ServerPage.prototype.sendMessage = function () {
        console.log(this.testMessage);
        /*this.http.get('https://www.reddit.com/r/gifs/new/.json?limit=10').map(res => res.json()).subscribe(data => {
            console.log(data);
        });*/
        this.http.get('http://141.28.131.171:8080/posts', {}, {}).then(function (data) {
            console.log("Data: " + data.data);
        })
            .catch(function (error) {
            console.log("Error Status: " + error.status);
            console.log("Error ERROR: " + error.error);
            console.log("Error Headers: " + error.headers);
        });
        setInterval(this.sendMessage(), 10000);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", String)
    ], ServerPage.prototype, "testMessage", void 0);
    ServerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-server',template:/*ion-inline-start:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\server\server.html"*/'<input [(ngModel)]="testMessage" type="text" placeholder="Message">\n\n<button (click)="sendMessage()" class="button button-small">\nSend\n</button>\n'/*ion-inline-end:"C:\Users\johan\OneDrive\Websites\app_forschungsprojekt\cowau\src\pages\server\server.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_http__["a" /* HTTP */]])
    ], ServerPage);
    return ServerPage;
}());

//# sourceMappingURL=server.js.map

/***/ })

},[196]);
//# sourceMappingURL=main.js.map