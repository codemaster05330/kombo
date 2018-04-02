import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IdlePage } from './idle';

@NgModule({
  declarations: [
    IdlePage,
  ],
  imports: [
    IonicPageModule.forChild(IdlePage),
  ],
})
export class IdlePageModule {}

var hallo = "Hallo";

console.log(hallo);
