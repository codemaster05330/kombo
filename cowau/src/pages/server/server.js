var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Sequence, SoundType } from '../../classes/sequence';
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
        var s = new Sequence(SoundType.Bass);
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
        Input(),
        __metadata("design:type", String)
    ], ServerPage.prototype, "testMessage", void 0);
    ServerPage = __decorate([
        Component({
            selector: 'page-server',
            templateUrl: 'server.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, HTTP, Platform])
    ], ServerPage);
    return ServerPage;
}());
export { ServerPage };
//# sourceMappingURL=server.js.map