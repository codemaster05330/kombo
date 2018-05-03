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
import { NavController, NavParams } from 'ionic-angular';
import { Variables } from '../../classes/variables';
import { FlipitPage } from '../flipit/flipit';
/**
 * Generated class for the EmojiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EmojiPage = /** @class */ (function () {
    function EmojiPage(navCtrl, navParams, globalVars) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.globalVars = globalVars;
    }
    EmojiPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EmojiPage');
    };
    EmojiPage.prototype.clickMe = function (evt) {
        console.log(evt.currentTarget);
        var elem = evt.currentTarget;
        this.globalVars.emojiID = Number(elem.id);
        this.navCtrl.setRoot(FlipitPage);
    };
    EmojiPage = __decorate([
        Component({
            selector: 'page-emoji',
            templateUrl: 'emoji.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Variables])
    ], EmojiPage);
    return EmojiPage;
}());
export { EmojiPage };
//# sourceMappingURL=emoji.js.map