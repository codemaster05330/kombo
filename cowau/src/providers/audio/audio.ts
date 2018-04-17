import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';

declare var AudioContext;
declare var webkitAudioContext;

@Injectable()
export class AudioProvider {

    // Object for handyling user feedback with Ionic's LoadingController API Methods
    private _PRELOADER              : any;
    // Object for decoded audio data
    private _TRACK                  : any;
    // Object for decoded audioo data
    private _AUDIO                  : any;
    // Object for handling audio buffer data
    private _SOURCE                 : any;
    // Object for handling audio context
    private _CONTEXT                : any;
    // Object for handling audio volume changes
    private _GAIN                   : any = null;


    constructor(public http: HttpClient) {
        console.log('Hello AudioProvider Provider');

    }

    loadSound(track : string) : void {
    }

}
