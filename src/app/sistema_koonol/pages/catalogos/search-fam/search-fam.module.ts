import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SearchFamComponent } from './search-fam.component';


@NgModule({
  declarations: [
    SearchFamComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    BrowserModule
  ]
})
export class SearchModule { }
