import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { BaseLoggedComponent } from './base-logged/base-logged.component';
import { BaseAuthComponent } from './base-auth/base-auth.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    MenuComponent,
    BaseLoggedComponent,
    BaseAuthComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule
  ]
})
export class LayoutModule { }
