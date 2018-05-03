var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Platform, Events } from 'ionic-angular';
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { Sequence, SoundType } from '../../classes/sequence';
import { Popover } from '../../classes/popover';
import { GesturesService } from '../../services/gestures.service';
var EditPage = /** @class */ (function () {
    function EditPage(navCtrl, navParams, platform, events, gesturesService, popoverCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.events = events;
        this.gesturesService = gesturesService;
        this.popoverCtrl = popoverCtrl;
        this.tmpBeatGrid = [];
        this.isScrolling = false;
        this.deltaTime = 1000000;
        this.wasEmpty = true;
        this.sound = new Sequence(SoundType.Bass);
        this.sound.clearBeatGrid();
        this.beatGrid = this.sound.getBeatGrid();
        for (var i = 0; i < 5; i++) {
            this.tmpBeatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.tmpBeatGrid[i][j] = 0;
            }
        }
        //FLIP EVENT
        this.popover = new Popover(popoverCtrl);
        platform.ready().then(function (readySource) {
            if (readySource == 'cordova' || readySource == 'mobile') {
                _this.gesturesService.watchForGesture();
            }
        });
    }
    EditPage.prototype.ionViewDidLoad = function () {
        var _this = this;
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
        this.beatgrid.style.transform = "translate( -5vw , 0)";
        this.events.subscribe('thrown', function (value) {
            console.log('thrown event');
        });
        this.events.subscribe('flipped', function (value) {
            console.log('FLIPPED edit page');
            _this.popover.show(NewSoundPopoverPage, 1000);
        });
    };
    EditPage.prototype.reloadGrid = function () {
        var cvs = document.getElementsByClassName('tone');
        for (var i = 0; i < cvs.length; i++) {
            var x = +cvs[i].id.split("-")[0];
            var y = +cvs[i].id.split("-")[1];
            if (cvs[i].children.length > 0) {
                cvs[i].removeChild(cvs[i].children[0]);
            }
            var num = this.sound.getBeatGrid()[x][y];
            if (num > 0) {
                var tone = this.createLongTone(this.calculateLongToneWidth(num - 1, y));
                cvs[i].appendChild(tone);
                this.setPreview(x, y, num);
            }
        }
    };
    /*
    *		CLEAR SOUND TEXT
    */
    EditPage.prototype.clearSound = function () {
        this.sound.clearBeatGrid();
        this.clearSmallGrid();
        this.sound.fillBeatGridAtRandom();
        this.reloadGrid();
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
        var x = +elem.id.split("-")[0];
        var y = +elem.id.split("-")[1];
        if (elem.classList.contains("tone")) {
            this.sound.setBeatGridAtPos(x, y, 1);
            this.setPreview(x, y, 1);
            elem.appendChild(this.createLongTone());
        }
        else if (elem.classList.contains("tone-long")) {
            this.sound.setBeatGridAtPos(x, y, 0);
            this.setPreview(parseInt(elem.parentElement.id.split("-")[0]), parseInt(elem.parentElement.id.split("-")[1]), 0);
            elem.parentElement.removeChild(elem);
        }
    };
    //TODO: Prevent overlapping
    //TODO: Account for measure gaps
    EditPage.prototype.panTone = function (evt) {
        /*var panLength :number = evt.deltaX;
        var passedTones: number = Math.floor((panLength / this.vw) / 11.1);

        
        if(passedTones >= 0){
            var tone:HTMLElement = <HTMLElement> evt.target;

            if (tone.classList.contains("tone-long")){
                var tmp = tone;
                tone = tone.parentElement;
            }

            if (tone.children.length > 0){
                tone.removeChild(tone.children[0]);
            }

            var y: number = +tone.id.split("-")[1];
            //console.log(y + " " + ((10 + ((7 - (y % 8)) * 12)) * this.vw) + " " + panLength + "; " + ((10 + ((7 - (y % 8)) * 12)) * this.vw <= panLength));
            if (Math.floor((10 + ((7 - (y % 8)) * 12)) * this.vw) <= panLength){
                passedTones -= 1;
                panLength -= 9 * this.vw;
            }
            //console.log(passedTones);

            var longtone :HTMLElement = document.createElement("div");
            longtone.classList.add("tone-long");
            var width = 10 + 12 * (passedTones);
            if (((y % 8) - ((y+passedTones)% 8 + 1) >= 0 ) || ((passedTones) / 8 >= 1)){
                width += 9;
            }

            longtone.style.width =  width+"vw";
            tone.appendChild(longtone);

            this.setPreview(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));
            this.sound.setBeatGridAtPos(parseInt(tone.id.split("-")[0]), parseInt(tone.id.split("-")[1]), (passedTones + 1));

        } else {
            
        }*/
        //detect if a new pan has been started.
        if (evt.deltaTime < this.deltaTime) {
            //if the delay between the click and the movement is above 300ms don't scroll but move the screen
            //TODO: MAKE SURE IT WORKS WITH LONG PAUSES (e.g. through timestamps)
            if (evt.deltaTime > 200 && !(evt.target.classList.contains("beatgrid") || evt.target.classList.contains("beatrow"))) {
                this.isScrolling = false;
            }
            else {
                this.isScrolling = true;
            }
            //get the current translation of the main beatgrid to be able to move it accordingly.
            this.translation = parseInt(this.beatgrid.style.transform.slice(10).split("vw")[0]);
            if (!this.isScrolling) {
                //save the relative X of the start of the event relative to the parent element
                //get middle x coordinate of the parent element1
                var middleX = evt.target.getBoundingClientRect().left + (evt.target.offsetWidth / 2);
                //get starting point of the users click
                var startX = evt.center.x - evt.deltaX;
                this.relativeX = startX - middleX;
            }
            this.orignalTarget = evt.target;
            this.wasEmpty = true;
            if (evt.target.classList.contains("tone-long")) {
                this.wasEmpty = false;
                this.orignalTarget = this.orignalTarget.parentElement;
            }
            console.log(evt.target.classList, this.isScrolling);
        }
        this.deltaTime = evt.deltaTime;
        if (this.isScrolling) { //if the current pan gesture is a scroll gesture, move the screen
            var translate = (this.translation * this.vw + evt.deltaX) / this.vw;
            translate = Math.max(Math.min(-5, translate), -319);
            this.beatgrid.style.transform = "translate( " + translate + "vw , 0)";
            //move the preview as well
            var prevXMin = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2);
            var x = -1 * (((translate + 5) / 314) * (this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth)) + prevXMin;
            var prevXMax = ((this.beatgridWrapper.offsetWidth - this.beatgridWrapperPreview.offsetWidth) / 2) + this.beatgridWrapperPreview.offsetWidth - this.beatPreviewSlider.offsetWidth;
            this.beatPreviewSlider.style.left = Math.min(Math.max(prevXMin, x), prevXMax) + "px";
        }
        //TODO: Make sure already existing ones get overridden!
        else { // if the current pan gesture is a drawing gesture, create the new tones
            var tone = evt.target;
            //if the target is a long one, get the actual target
            if (tone.classList.contains("tone-long")) {
                var tmp = tone;
                tone = tone.parentElement;
            }
            //if it already has a long one inside of it, remove it
            if (tone.children.length > 0 && tone.classList.contains("tone")) {
                tone.removeChild(tone.children[0]);
                this.setPreview(+tone.id.split("-")[0], +tone.id.split("-")[1], 0);
            }
            //calculate passed tones
            var y = +this.orignalTarget.id.split("-")[1];
            var passedTones = Math.floor(((this.relativeX + evt.deltaX) / this.vw) / 11.1); //11.1vw is the width of one tone + one side of the margin	
            if (passedTones < 0)
                passedTones++;
            //if we pass a gap, wait longer.
            if (Math.floor((y + passedTones) / 8) != Math.floor(y / 8)) {
                passedTones = Math.floor(((this.relativeX + evt.deltaX - (Math.sign(evt.deltaX) * 9 * this.vw)) / this.vw) / 11.1);
            }
            //if we are at one of the ends, cut it short
            if (y + passedTones < 0) {
                passedTones = -y;
            }
            else if (y + passedTones >= 32) {
                passedTones = 31 - y;
            }
            //remove obsolete divs
            if (this.previousPassedTones < passedTones && Math.sign(this.previousPassedTones) < 0) {
                var target = this.orignalTarget;
                for (var i = this.previousPassedTones; i < 0; i++) {
                    if (target.previousElementSibling != null) {
                        target = target.previousElementSibling;
                        if (target.children.length > 0 && target.classList.contains("tone"))
                            target.removeChild(target.children[0]);
                        this.setPreview(+target.id.split("-")[0], +target.id.split("-")[1], 0);
                    }
                }
            }
            this.previousPassedTones = passedTones;
            // if it was an empty one originally
            if (this.wasEmpty) {
                var target = this.orignalTarget;
                for (var i = passedTones; i < 0; i++) {
                    if (target.previousElementSibling != null) {
                        target = target.previousElementSibling;
                        if (target.children.length > 0)
                            target.removeChild(target.children[0]);
                        this.setPreview(+target.id.split("-")[0], +target.id.split("-")[1], 0);
                    }
                }
                target.appendChild(this.createLongTone(this.calculateLongToneWidth(passedTones, y)));
                this.setPreview(+target.id.split("-")[0], +target.id.split("-")[1], Math.abs(passedTones) + 1);
            }
            //if it was an occupied one originally change it's size
            else {
            }
            //console.log(passedTones);
        }
    };
    /*
    *		LONG TONE SUPPORT FUNCTIONS
    */
    EditPage.prototype.createLongTone = function (width) {
        if (width === void 0) { width = 10; }
        var longtone = document.createElement("div");
        longtone.classList.add("tone-long");
        longtone.style.width = width + "vw";
        return longtone;
    };
    EditPage.prototype.calculateLongToneWidth = function (passedTones, y) {
        var width = 10 + 12 * Math.abs(passedTones);
        if ((Math.floor(y / 8) != Math.floor((y + passedTones) / 8) || ((passedTones) / 8 >= 1))) {
            width += 8;
        }
        return width;
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
                    var divLength = 2 + 2.6 * (length - 1);
                    if (((y % 8) - ((y + length - 1) % 8) >= 0) || (length / 8 >= 1)) {
                        divLength += 1.1;
                    }
                    longtonePrev.style.width = divLength + "vw";
                    this.beatgridPreview[i].appendChild(longtonePrev);
                }
            }
        }
    };
    EditPage = __decorate([
        Component({
            selector: 'page-edit',
            templateUrl: 'edit.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Platform, Events, GesturesService,
            PopoverController])
    ], EditPage);
    return EditPage;
}());
export { EditPage };
//# sourceMappingURL=edit.js.map