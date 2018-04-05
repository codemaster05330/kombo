import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlipitPage } from './flipit';

@NgModule({
  declarations: [
    FlipitPage,
  ],
  imports: [
    IonicPageModule.forChild(FlipitPage),
  ],
})
export class FlipitPageModule {}
