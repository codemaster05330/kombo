import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { MetricSync } from '../../services/metric-sync.service';
import { Socket } from 'ng-socket-io';
import { GesturesService } from '../../services/gestures.service';

// Import the pages, that are needed for this page
import { EmojiPage } from '../emoji/emoji';

// Import every classes
import { Variables } from '../../classes/variables';
import { GestureType } from '../../classes/gesture-type';
import { SoundWave } from '../../classes/sound-wave';

@Component({
	selector: 'page-load',
	templateUrl: 'load.html',
})

export class LoadingPage {


    constructor() {
        console.log("Loading Page");
    }
}
