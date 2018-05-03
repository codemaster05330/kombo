var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
var AudioProvider = /** @class */ (function () {
    function AudioProvider(http) {
        this.http = http;
        // Object for handling audio volume changes
        this._GAIN = null;
        console.log('Hello AudioProvider Provider');
    }
    AudioProvider.prototype.loadSound = function (track) {
    };
    AudioProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], AudioProvider);
    return AudioProvider;
}());
export { AudioProvider };
//# sourceMappingURL=audio.js.map