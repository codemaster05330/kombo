import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Popover } from '../../popover/popover';
import { PopoverController } from 'ionic-angular';

/**
 * Generated class for the FlipitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-flipit',
  templateUrl: 'flipit.html',
})
export class FlipitPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FlipitPage');
  }

  @Component({})
  
}
