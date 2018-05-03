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
import { NavController, NavParams, Platform, PopoverController, Events } from 'ionic-angular';
import { Popover } from '../../classes/popover';
import { GesturesService } from '../../services/gestures.service';
import { NewSoundPopoverPage } from '../../newsound-popover/newsound-popover';
import { EditPage } from '../edit/edit';
/**
 * Generated class for the FlipitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var FlipitPage = /** @class */ (function () {
    function FlipitPage(navCtrl, navParams, gesturesService, platform, popoverCtrl, events) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.gesturesService = gesturesService;
        this.platform = platform;
        this.popoverCtrl = popoverCtrl;
        this.events = events;
        this.lookOfEvents = ['flipped'];
        this.popover = new Popover(popoverCtrl);
        platform.ready().then(function (readySource) {
            if (readySource == 'cordova' || readySource == 'mobile') {
                _this.gesturesService.watchForGesture(_this.lookOfEvents);
            }
        });
        events.subscribe('flipped', function (acceleration) {
            console.log('FLIPPED flipitpage');
            _this.popover.show(NewSoundPopoverPage, 1000);
            setTimeout(function () {
                _this.gesturesService.stopGestureWatch(_this.events, 'flipped');
                _this.navCtrl.setRoot(EditPage);
            }, 300);
        });
    }
    FlipitPage.prototype.switchScreen = function () {
        this.navCtrl.setRoot(EditPage);
    };
    FlipitPage = __decorate([
        Component({
            selector: 'page-flipit',
            templateUrl: 'flipit.html'
        }),
        __metadata("design:paramtypes", [NavController, NavParams, GesturesService, Platform,
            PopoverController, Events])
    ], FlipitPage);
    return FlipitPage;
}());
export { FlipitPage };
//# sourceMappingURL=flipit.js.map