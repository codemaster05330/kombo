// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Http, ResponseContentType } from '@angular/http';
//
// declare var AudioContext;
//
// @Injectable()
// export class AudioProvider {
//
//     private _TRACK                  : any = null;
//     private _AUDIO                  : any;
//     private _SOURCE                 : any;
//     private _CONTEXT                : any = new (AudioContext)();
//     private _GAIN                   : any = null;
//
//     constructor(public http     : HttpClient,
//                 private _LOADER : LoadingController) {
//     }
//
//     loadSound(track : string) : void {
//         this.http.get(track, { responseType: ResponseContentType.ArrayBuffer })
//         .map(res => res.arrayBuffer())
//         .subscribe((arrayBufferContent : any) =>
//         {
//             this.setUpAudio(arrayBufferContent);
//         });
//     }
//
//     setUpAudio(bufferedContent : any) : void {
//         this._CONTEXT.decodeAudioData(bufferedContent, (buffer : any) =>
//         {
//             this._AUDIO         = buffer;
//             this._TRACK         = this._AUDIO;
//             this.playSound(this._TRACK);
//         });
//     }
//
//     playSound(track : any) : void {
//         if(!this._CONTEXT.createGain) {
//             this._CONTEXT.createGain = this._CONTEXT.createGainNode;
//         }
//         this._GAIN                      = this._CONTEXT.createGain;
//         this._SOURCE                    = this._CONTEXT.createBufferSource();
//         this._SOURCE.buffer             = track;
//         this._SOURCE.connect(this._GAIN);
//         this._GAIN.connect(this._CONTEXT.destination);
//
//         this._SOURCE.start(0);
//     }
//
//     stopSound() : void {
//         if( !this._SOURCE.stop) {
//             this._SOURCE.stop = this._SOURCE.noteOff;
//         }
//         this._SOURCE.stop(0);
//     }
//
//     changeVolume(volume : any) : void {
//         let percentile : number = parseInt(volume.value) / parseInt(volume.max);
//         this._GAIN.gain.value = percentile * percentile;
//     }
//
// }
//
// // let c = new AudioContext();
// // let osc = c.createOscillator();
// // osc.frequency.value = 440;
// // osc.connect(c.destination);
// // osc.start(0);
