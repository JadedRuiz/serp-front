import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogosRoutingModule } from './catalogos-routing.module';

import { NgxImageCompressService } from 'ngx-image-compress';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { InicioComponent } from './inicio/inicio.component';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReglamentoComponent } from './reglamento/reglamento.component';



@NgModule({
  declarations: [

    InicioComponent,
      ReglamentoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CatalogosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    MatCardModule,
    MatButtonModule

  ],
  providers : [NgxImageCompressService]
})
export class CatalogosModule { }
