import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ControllBoxComponent } from './controll-box';

@NgModule({
  declarations: [
    ControllBoxComponent,
  ],
  imports: [
    IonicPageModule.forChild(ControllBoxComponent),
  ],
  exports: [
    ControllBoxComponent
  ]
})
export class ControllBoxComponentModule {
}
