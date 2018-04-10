webpackJsonp([0],{

/***/ 111:
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
webpackEmptyAsyncContext.id = 111;

/***/ }),

/***/ 153:
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
webpackEmptyAsyncContext.id = 153;

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_sound__ = __webpack_require__(202);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EditPage = /** @class */ (function () {
    function EditPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.tmpBeatGrid = [];
        this.sound = new __WEBPACK_IMPORTED_MODULE_2__classes_sound__["a" /* Sound */](__WEBPACK_IMPORTED_MODULE_2__classes_sound__["b" /* SoundType */].Bass);
        this.sound.clearBeatGrid();
        this.beatGrid = this.sound.getBeatGrid();
        for (var i = 0; i < 5; i++) {
            this.tmpBeatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.tmpBeatGrid[i][j] = 0;
            }
        }
    }
    EditPage.prototype.ionViewDidLoad = function () {
        this.beatgridWrapper = document.getElementById('beatgrid-wrapper');
        this.beatgrid = document.getElementById('beatgrid');
        this.beatgridWrapper.style.height = (this.beatgrid.offsetHeight) + "px";
        this.beatgridWrapperPreview = document.getElementById('beatgrid-wrapper-preview');
        this.beatrowPreview = document.getElementById('beatrow-preview');
        this.beatgridWrapperPreview.style.width = (this.beatrowPreview.offsetWidth + 1) + "px";
        this.beatPreviewSlider = document.getElementById('beatpreview-slider');
        this.beatgridPreview = document.getElementsByClassName('tone-preview');
        this.beatPreviewSlider.style.left = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2) + "px";
        this.vw = (this.beatgridWrapper.offsetWidth / 100);
    };
    EditPage.prototype.reloadGrid = function () {
        var cvs = document.getElementsByClassName('tone');
        for (var i = 0; i < cvs.length; i++) {
            var x = +cvs[i].id.split("-")[0];
            var y = +cvs[i].id.split("-")[1];
            if (cvs[i].children.length > 0) {
                cvs[i].removeChild(cvs[i].children[0]);
            }
            if (this.sound.getBeatGrid()[x][y] == 0) {
                cvs[i].classList.remove("tone-selected");
            }
            else {
                cvs[i].classList.add("tone-selected");
            }
        }
    };
    /*
    *		CLEAR SOUND TEXT
    */
    EditPage.prototype.clearSound = function () {
        this.sound.clearBeatGrid();
        this.reloadGrid();
        this.clearSmallGrid();
    };
    EditPage.prototype.clearSmallGrid = function () {
        for (var i = 0; i < this.beatgridPreview.length; i++) {
            this.beatgridPreview[i].classList.remove("tone-selected-preview");
            if (this.beatgridPreview[i].children.length > 0) {
                this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0]);
            }
        }
    };
    /*
    *		ACTUAL TONES
    */
    EditPage.prototype.clickedTone = function (evt) {
        var elem = evt.target;
        if (elem.classList.contains("tone")) {
            var x = +elem.id.split("-")[0];
            var y = +elem.id.split("-")[1];
            if (elem.classList.toggle("tone-selected")) {
                this.sound.setBeatGridAtPos(x, y, 1);
                this.setPreview(x, y, 1);
            }
            else {
                this.sound.setBeatGridAtPos(x, y, 0);
                this.setPreview(x, y, 0);
            }
        }
        else if (elem.classList.contains("tone-long")) {
            this.sound.setBeatGridAtPos(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]), 0);
            this.setPreview(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]), 0);
            elem.parentElement.removeChild(elem);
        }
        //console.log(this.sound.getBeatGrid());
    };
    //TODO: Prevent overlapping
    EditPage.prototype.panTone = function (evt) {
        var panLength = evt.deltaX;
        var passedTones = Math.floor((panLength / this.vw) / 11.1);
        if (passedTones >= 0) {
            var tone = evt.target;
            if (tone.classList.contains("tone-long")) {
                var tmp = tone;
                tone = tone.parentElement;
            }
            if (tone.children.length > 0) {
                tone.removeChild(tone.children[0]);
            }
            var longtone = document.createElement("div");
            longtone.classList.add("tone-long");
            var width = 11.8 * (passedTones + 1) - 1; //TODO: Account for measure gaps
            longtone.style.width = width + "vw";
            tone.appendChild(longtone);
            this.setPreview(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));
            this.sound.setBeatGridAtPos(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));
        }
        else {
        }
    };
    /*
    *		PREVIEW SLIDER
    */
    EditPage.prototype.panPreview = function (evt) {
        var x = evt.srcEvent.clientX - (this.beatPreviewSlider.offsetWidth / 2);
        var prevXMin = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2);
        var prevXMax = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;
        this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin, x), prevXMax) + "px";
        this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin, x), prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 314) - 5) + "vw , 0)";
    };
    EditPage.prototype.clickPreview = function (evt) {
        var x = evt.x - (this.beatPreviewSlider.offsetWidth / 2);
        var prevXMin = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2);
        var prevXMax = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;
        this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin, x), prevXMax) + "px";
        this.beatgrid.style.transform = "translate( " + ((-1 * ((Math.min(Math.max(prevXMin, x), prevXMax) - prevXMin) / (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) * 314) - 5) + "vw , 0)";
    };
    EditPage.prototype.setPreview = function (x, y, length) {
        for (var i = 0; i < this.beatgridPreview.length; i++) {
            var xp = +this.beatgridPreview[i].id.split("-")[0];
            var yp = +this.beatgridPreview[i].id.split("-")[1];
            if (xp == x && yp == y) {
                if (this.beatgridPreview[i].children.length > 0) {
                    this.beatgridPreview[i].removeChild(this.beatgridPreview[i].children[0]);
                }
                if (length == 0) {
                    this.beatgridPreview[i].classList.remove("tone-selected-preview");
                    break;
                }
                else if (length == 1) {
                    this.beatgridPreview[i].classList.add("tone-selected-preview");
                    break;
                }
                else if (length > 1) {
                    this.beatgridPreview[i].classList.remove("tone-selected-preview");
                    var longtonePrev = document.createElement("div");
                    longtonePrev.classList.add("tone-long-preview");
                    longtonePrev.style.width = 2 + 2.6 * (length - 1) + "vw"; //TODO: Account for measure gaps
                    this.beatgridPreview[i].appendChild(longtonePrev);
                }
            }
        }
    };
    EditPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-edit',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\edit\edit.html"*/'<!-- <div class="headline">\n	Edit Screen\n</div>\n\n<div class="subline">\n	Make your Sound\n</div> -->\n<div class="edit-wrapper">\n	<div class="beatgrid-wrapper" id="beatgrid-wrapper">\n		<div class="beatgrid" id="beatgrid">\n			<div *ngFor="let cell of tmpBeatGrid; let i = index" class="beatrow">\n				<div (click)="clickedTone($event)" (pan)="panTone($event)" *ngFor="let cell of tmpBeatGrid[i]; let j = index" id="{{i}}-{{j}}" class="tone">\n					\n				</div>\n			</div>\n		</div>\n	</div>\n	<div (pan)="panPreview($event)" (click)="clickPreview($event)" class="slider-wrapper">\n		<div class="beatpreview-slider" id="beatpreview-slider">\n			\n		</div>\n		<div class="beatgrid-wrapper-preview" id="beatgrid-wrapper-preview">\n				<div *ngFor="let cell of tmpBeatGrid; let i = index" class="beatrow-preview" id="beatrow-preview">\n					<div *ngFor="let cell of tmpBeatGrid[i]; let j = index" id="{{i}}-{{j}}" class="tone-preview">\n						\n					</div>\n				</div>\n		</div>\n	</div>\n	<div (click)="clearSound()" class="clearsound">Clear your sound</div>\n</div>\n\n<div class="bottom-bar"></div>\n<div class="background-pattern-dark"></div>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\edit\edit.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */]])
    ], EditPage);
    return EditPage;
}());

//# sourceMappingURL=edit.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SoundType; });
var Sound = /** @class */ (function () {
    function Sound(_type, _toneheights) {
        if (_toneheights === void 0) { _toneheights = 5; }
        this.type = _type;
        //randomly selects an id between -32767 and 32767
        this.id = Math.floor(Math.random() * (32767 + 32767 + 1)) - 32767;
        this.beatGrid = [];
        //initialise the beat grid with 0s
        for (var i = 0; i < _toneheights; i++) {
            this.beatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.beatGrid[i][j] = 0;
            }
        }
    }
    Sound.prototype.getId = function () {
        return this.id;
    };
    Sound.prototype.getType = function () {
        return this.type;
    };
    Sound.prototype.getBeatGrid = function () {
        return this.beatGrid;
    };
    Sound.prototype.setBeatGrid = function (grid) {
        if (this.beatGrid.length == grid.length && this.beatGrid[0].length == grid[0].length) {
            this.beatGrid = grid;
            return true;
        }
        else {
            return false;
        }
    };
    Sound.prototype.setBeatGridAtPos = function (x, y, value) {
        if (x < this.beatGrid.length && x >= 0 && y < this.beatGrid[0].length && y >= 0 && value >= 0) {
            this.beatGrid[x][y] = value;
            return true;
        }
        else {
            return false;
        }
    };
    Sound.prototype.clearBeatGrid = function () {
        var x = this.beatGrid.length;
        this.beatGrid = [];
        for (var i = 0; i < x; i++) {
            this.beatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.beatGrid[i][j] = 0;
            }
        }
    };
    return Sound;
}());

// Enum to hold the different types of Sounds. please add the possible sounds here.
var SoundType;
(function (SoundType) {
    SoundType[SoundType["Drums"] = 0] = "Drums";
    SoundType[SoundType["Bass"] = 1] = "Bass";
    SoundType[SoundType["Marimba"] = 2] = "Marimba";
})(SoundType || (SoundType = {}));
//# sourceMappingURL=sound.js.map

/***/ }),

/***/ 203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewSoundPopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NewSoundPopoverPage = /** @class */ (function () {
    function NewSoundPopoverPage(viewCtrl, popoverCtrl) {
        this.viewCtrl = viewCtrl;
        this.popoverCtrl = popoverCtrl;
    }
    NewSoundPopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'new-sound-popover',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\newsound-popover\newsound-popover.html"*/'<div class="background-opacity">\n	<div class="popover-base">\n		<div class="subline">\n			Your new sound	\n		</div>\n		<div class="headline">\n			Bzzzzzz <!-- Insert dynamic name here -->\n		</div>\n		<div class="explain-text">\n			You can still flip to get the next one. \n		</div>\n	</div>\n</div>\n\n\n	\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\newsound-popover\newsound-popover.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* PopoverController */]])
    ], NewSoundPopoverPage);
    return NewSoundPopoverPage;
}());

//# sourceMappingURL=newsound-popover.js.map

/***/ }),

/***/ 204:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(226);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_gyroscope__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_device_motion__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_http__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__rxjs_extensions__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_component__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_flipit_flipit__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_idle_idle__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_emoji_emoji__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_edit_edit__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__newsound_popover_newsound_popover__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_visual_visual__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_server_server__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_gestures_service__ = __webpack_require__(54);
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
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_12__pages_emoji_emoji__["a" /* EmojiPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_flipit_flipit__["a" /* FlipitPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_idle_idle__["a" /* IdlePage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_edit_edit__["a" /* EditPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_visual_visual__["a" /* VisualPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_server_server__["a" /* ServerPage */],
                __WEBPACK_IMPORTED_MODULE_14__newsound_popover_newsound_popover__["a" /* NewSoundPopoverPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_9__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_12__pages_emoji_emoji__["a" /* EmojiPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_flipit_flipit__["a" /* FlipitPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_idle_idle__["a" /* IdlePage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_edit_edit__["a" /* EditPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_visual_visual__["a" /* VisualPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_server_server__["a" /* ServerPage */],
                __WEBPACK_IMPORTED_MODULE_14__newsound_popover_newsound_popover__["a" /* NewSoundPopoverPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_gyroscope__["a" /* Gyroscope */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_device_motion__["a" /* DeviceMotion */],
                __WEBPACK_IMPORTED_MODULE_17__services_gestures_service__["a" /* GesturesService */],
                __WEBPACK_IMPORTED_MODULE_7__ionic_native_http__["a" /* HTTP */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 275:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_of__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_debounceTime__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_debounceTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_debounceTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_distinctUntilChanged__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_distinctUntilChanged___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_distinctUntilChanged__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_do__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_filter__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__);
// Observable class extensions


// Observable operators







//# sourceMappingURL=rxjs-extensions.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_visual_visual__ = __webpack_require__(307);
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
    // rootPage:any = ServerPage;
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]) === "function" && _c || Object])
    ], MyApp);
    return MyApp;
    var _a, _b, _c;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlipitPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_popover__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_gestures_service__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__newsound_popover_newsound_popover__ = __webpack_require__(203);
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
    function FlipitPage(navCtrl, navParams, gesturesService, platform, popoverCtrl, viewCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.gesturesService = gesturesService;
        this.platform = platform;
        this.popoverCtrl = popoverCtrl;
        this.viewCtrl = viewCtrl;
        this.popover = new __WEBPACK_IMPORTED_MODULE_2__classes_popover__["a" /* Popover */](popoverCtrl, viewCtrl);
        platform.ready().then(function (readySource) {
            if (readySource == 'cordova') {
                _this.gesturesService.isFlipItGesture();
            }
        });
    }
    FlipitPage.prototype.ionViewDidLoad = function () {
        // this.gesturesService.isFlipItGesture();
        this.popover.show(__WEBPACK_IMPORTED_MODULE_4__newsound_popover_newsound_popover__["a" /* NewSoundPopoverPage */]);
    };
    FlipitPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-flipit',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\flipit\flipit.html"*/'<div class="headline">\n  Flip It!\n</div>\n\n<div class="subline">\n  And get your sound. \n</div>\n\n<div class="video"></div>\n\n<div class="bottom-bar"></div>\n\n<div class="background-pattern-dark"></div>\n\n\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\flipit\flipit.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__services_gestures_service__["a" /* GesturesService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* PopoverController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ViewController */]])
    ], FlipitPage);
    return FlipitPage;
}());

//# sourceMappingURL=flipit.js.map

/***/ }),

/***/ 304:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Popover; });
//import { PopoverPage } from '../newsound-popover/newsound-popover';
var Popover = /** @class */ (function () {
    function Popover(popoverCtrl, viewCtrl) {
        this.popoverCtrl = popoverCtrl;
        this.viewCtrl = viewCtrl;
    }
    Popover.prototype.show = function (p) {
        var popover = this.popoverCtrl.create(p);
        popover.present();
        setTimeout(this.close, 3000);
    };
    // Todo: insert dynamic soundname parameter.
    Popover.prototype.close = function () {
        console.log("HALLLLOOOO");
        // this.viewCtrl.dismiss();
    };
    return Popover;
}());

//# sourceMappingURL=popover.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IdlePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__ = __webpack_require__(54);
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
            selector: 'page-idle',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\idle\idle.html"*/'<div id="call-to-action" class="call-to-aktion">\n    <div class="call-to-action-title">\n        Pick me up!\n    </div>\n</div>\n\n<canvas id="canvas" class="canvas-idle"></canvas>\n\n<div class="background-pattern"></div>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\idle\idle.html"*/,
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

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmojiPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
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
    EmojiPage.prototype.clickMe = function (evt) {
        console.log(evt.currentTarget);
        var elem = evt.currentTarget;
        console.log(elem.id);
    };
    EmojiPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-emoji',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\emoji\emoji.html"*/'<div class="headline">\n  Who are you?\n</div>\n\n<div class="subline">\n  Pick your Emoji. \n</div>\n\n<div class="flex-container">\n	<div (click)="clickMe($event)" id="0"><img src="../../../assets/imgs/logo.png" alt="logo1"></div>\n	<div (click)="clickMe($event)" id="1"><img src="../../../assets/imgs/logo.png" alt="logo2"></div>\n	<div (click)="clickMe($event)" id="2"><img src="../../../assets/imgs/logo.png" alt="logo3"></div>\n	<div (click)="clickMe($event)" id="3"><img src="../../../assets/imgs/logo.png" alt="logo4"></div>\n	<div (click)="clickMe($event)" id="4"><img src="../../../assets/imgs/logo.png" alt="logo5"></div>\n	<div (click)="clickMe($event)" id="5"><img src="../../../assets/imgs/logo.png" alt="logo6"></div>\n	<div (click)="clickMe($event)" id="6"><img src="../../../assets/imgs/logo.png" alt="logo7"></div>\n	<div (click)="clickMe($event)" id="7"><img src="../../../assets/imgs/logo.png" alt="logo8"></div>\n	<div (click)="clickMe($event)" id="8"><img src="../../../assets/imgs/logo.png" alt="logo9"></div>\n	<div (click)="clickMe($event)" id="9"><img src="../../../assets/imgs/logo.png" alt="logo10"></div>\n	<div (click)="clickMe($event)" id="10"><img src="../../../assets/imgs/logo.png" alt="logo11"></div>\n	<div (click)="clickMe($event)" id="11"><img src="../../../assets/imgs/logo.png" alt="logo12"></div>\n</div>\n\n\n<div class="bottom-bar"></div>\n\n<div class="background-pattern-dark"></div>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\emoji\emoji.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */]])
    ], EmojiPage);
    return EmojiPage;
}());

//# sourceMappingURL=emoji.js.map

/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisualPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__ = __webpack_require__(54);
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
            selector: 'page-visual',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\visual\visual.html"*/'<canvas id="canvas" class="canvas-visual"></canvas>\n\n<div class="background-pattern"></div>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\visual\visual.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__["a" /* GesturesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_gestures_service__["a" /* GesturesService */]) === "function" && _c || Object])
    ], VisualPage);
    return VisualPage;
    var _a, _b, _c;
}());

// ###############################################################
// ###############################################################
// Create the Visual Screen Canvas
function initVisual() {
    // Create a new sound element just for testing
    // this part of the code can be removed in the final version
    var cta = document.getElementById('canvas');
    cta.addEventListener('click', function () {
        setupVisualScreen();
    });
    // Define a few important var/const for the following scripts
    var cvs = document.getElementById('canvas'); // Define the Canvas Element
    var ctx = cvs.getContext('2d'); // Setup the Canvas to 2D
    var ratio = window.devicePixelRatio; // Define the DPI of the Screen
    var fps = 60; // FPS of the Canvas
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
    // Function to create a new Soundobject with mass, x, y and radius
    function Sound(x, y, radius, mass, tones) {
        this.radius = radius; // radius of the sound
        this.x = x; // y position of the sound
        this.y = y; // x positon of the sound
        this.mass = mass; // Mass of the sound
        this.tones = tones; // Count the Tones in the sound
        this.lifeTimeValue = 100; // The lifetime of the object 100-0
        this.soundWaves = []; // The Soundwaves from this object
        this.velocity = {
            x: returnRandomValue(-5, 5),
            y: returnRandomValue(-5, 5) // velocity in the y direction
        };
        // Function to update the sound element
        // this function is used for Collision ditection,
        // movement and the drawing of the element
        this.updateSound = function () {
            for (var i = 0; i < this.soundWaves.length; i++) {
                var newSoundWave = this.soundWaves[i];
                newSoundWave.update();
            }
            var test = returnRandomValue(0, 30);
            if (test == 2) {
                this.createSoundWave();
            }
            this.borderDetectionSound(); // Controll if the object hits the wall
            this.moveSound(); // move the object random
            this.drawSound(); // draw the sound object
            this.lifeTime(); // reduce lifetime
            this.soundDetectionSound(); // Controll if the object hits another object
        };
        this.createSoundWave = function () {
            var soundWave = new Circle(this.soundWaves, this.radius, this.x, this.y, 2);
            this.soundWaves.push(soundWave);
        };
        this.lifeTime = function () {
            if ((this.lifeTimeValue / 100) > 0.03) {
                this.lifeTimeValue = this.lifeTimeValue - (this.lifeTimeValue / 100);
                // console.log('alive');
            }
            else {
                // console.log('die');
                soundsArray.splice(soundsArray.indexOf(this), 1);
            }
        };
        // Function to detect if the sound object hits an wall of the canvas
        // When the detects gets true, the velocity get negating
        this.borderDetectionSound = function () {
            if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
        };
        // Function to move the sound object in an
        // random direction
        this.moveSound = function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        };
        // Function to draw the Sound object into the canvas
        this.drawSound = function () {
            ctx.globalAlpha = (this.lifeTimeValue / 100);
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        };
        // Functiton to detect if the sound hits another sound object.
        // When this happend, this function starts the resloveCollision function.
        // Here this Sound object and the sound object that gets hit will get new
        // positions, with new velocity and mass.
        this.soundDetectionSound = function () {
            for (var i = 0; i < soundsArray.length; i++) {
                if (this === soundsArray[i])
                    continue;
                if (getDistance(this.x, soundsArray[i].x, this.y, soundsArray[i].y, this.radius, soundsArray[i].radius) < 0) {
                    resolveCollision(this, soundsArray[i]);
                }
            }
        };
    }
    // Function to draw Circles into the Canvas
    function Circle(soundWave, radius, xPos, yPos, speed) {
        this.radius = radius; // Radius of this object
        this.xPos = xPos; // x position of this object
        this.yPos = yPos; // y position of this object
        this.speed = speed; // Movementspeed of the Soundwave
        this.opacity = 1; // Opacity of the soundwave
        // Update the radius of the circle every frame,
        // indipendent from other Circles
        this.update = function () {
            this.radius += (this.speed * ratio); // Update the radus of this Circle
            this.opacity += -0.008;
            if (this.opacity < 0) {
                this.opacity = 0;
            }
            else {
                this.opacity += -0.008;
            }
            var gradient = ctx.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.radius);
            gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
            if (this.radius >= canvasWidth / 2 && this.radius >= canvasHeight / 2) {
                soundWave.splice(soundWave.indexOf(this), 1); // Delete old Circlces
            }
        };
    }
    // function to setup the Visual Screen and draw soundobjects into the canvas
    function setupVisualScreen() {
        var r = returnRandomValue(20, 200);
        var x = returnRandomValue(0 + r, canvasWidth - r);
        var y = returnRandomValue(0 + r, canvasHeight - r);
        var t = returnRandomValue(0, 256);
        var m = 20;
        var c = 0;
        for (var j = 0; j < soundsArray.length; j++) {
            if (c >= 20) {
                break;
            }
            c++;
            if (getDistance(x, soundsArray[j].x, y, soundsArray[j].y, r, soundsArray[j].radius) < 0) {
                x = returnRandomValue(0 + r, canvasWidth - r);
                y = returnRandomValue(0 + r, canvasHeight - r);
                j = -1;
            }
        }
        var newSound = new Sound(x, y, r, m, t);
        soundsArray.push(newSound);
    }
    // Start the Canvas Animation
    draw();
    function draw() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        soundsArray.forEach(function (soundsArray) {
            soundsArray.updateSound();
        });
        setTimeout(function () {
            requestAnimationFrame(draw);
        }, 1000 / fps);
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
function getDistance(x1, x2, y1, y2, r1, r2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)) - (r2 + r1);
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

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_http__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_sound__ = __webpack_require__(202);
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
    function ServerPage(navCtrl, navParams, http, platform) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.platform = platform;
        this.testMessage = "";
        platform.ready().then(function (readyState) {
            if (readyState == 'cordova') {
                console.log('cordova abailable');
                setInterval(function () { _this.repeatMe(); }, 5000);
            }
        });
    }
    ServerPage.prototype.repeatMe = function () {
        console.log("repeat");
        var s = new __WEBPACK_IMPORTED_MODULE_3__classes_sound__["a" /* Sound */](__WEBPACK_IMPORTED_MODULE_3__classes_sound__["b" /* SoundType */].Bass);
        /*this.http.get('http://141.28.131.171:8080/posts', {}, {}).then(
                (data) => {
                    console.log(data.data);
                }
            );*/
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
            selector: 'page-server',template:/*ion-inline-start:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\server\server.html"*/'<input [(ngModel)]="testMessage" type="text" placeholder="Message">\n\n<button (click)="sendMessage()" class="button button-small">\nSend\n</button>\n'/*ion-inline-end:"C:\Users\johan\Documents\Forschungsprojekt\cowau\src\pages\server\server.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_http__["a" /* HTTP */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */]])
    ], ServerPage);
    return ServerPage;
}());

//# sourceMappingURL=server.js.map

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GesturesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_gyroscope__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_device_motion__ = __webpack_require__(198);
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
//ionic native imports


var GesturesService = /** @class */ (function () {
    function GesturesService(devMotion, gyroscope, platform) {
        this.devMotion = devMotion;
        this.gyroscope = gyroscope;
        this.platform = platform;
    }
    GesturesService.prototype.isFlipItGesture = function () {
        var _this = this;
        var flipping_x = new Array();
        var flipping_y = new Array();
        this.platform.ready().then(function (readyState) {
            var treshold = 0.15;
            var gyro_opts = {
                frequency: 500
            };
            var acc_opts = {
                frequency: 500
            };
            _this.gyroscope.watch(gyro_opts).subscribe(function (orientation) {
                if (flipping_x.length == 10) {
                    console.log('hier');
                    flipping_x = new Array();
                }
                flipping_x.push({ time: orientation.timestamp, value: orientation.x });
                // console.log(flipping_x);
            });
            // this.devMotion.watchAcceleration(acc_opts).subscribe((acceleration: DeviceMotionAccelerationData) => {
            // console.log(roundFloat(acceleration.x, 1), roundFloat(acceleration.y, 1), roundFloat(acceleration.z, 1), acceleration.timestamp);
            // });
        });
        return true;
    };
    GesturesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ionic_native_device_motion__["a" /* DeviceMotion */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_gyroscope__["a" /* Gyroscope */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Platform */]])
    ], GesturesService);
    return GesturesService;
}());

function roundFloat(num, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
}
//# sourceMappingURL=gestures.service.js.map

/***/ })

},[204]);
//# sourceMappingURL=main.js.map