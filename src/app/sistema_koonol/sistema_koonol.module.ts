import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseLoggedComponent } from './shared/base-logged/base-logged.component';
import { GoogleMapsModule } from '@angular/google-maps'


@NgModule({
  declarations: [
    BaseLoggedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GoogleMapsModule
  ]
})
export class SistemaKoonolModule { }
