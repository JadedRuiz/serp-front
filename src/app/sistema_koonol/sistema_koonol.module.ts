import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseLoggedComponent } from './shared/base-logged/base-logged.component';
import { CarouselHeaderComponent } from './shared/carousel-header/carousel-header.component';


@NgModule({
  declarations: [
    BaseLoggedComponent,
    CarouselHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class SistemaKoonolModule { }
