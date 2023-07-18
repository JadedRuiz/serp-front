import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogosComponent } from './catalogos.component';
import { CatalogosRoutingModule } from './catalogos-routing.module';
import { AlmacenesComponent } from './almacenes/almacenes.component';

import { NgxImageCompressService } from 'ngx-image-compress';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { OrdersCartComponent } from './orders-cart/orders-cart.component';
import { OrdersPlacedComponent } from './orders-placed/orders-placed.component';
import { OrdersCartModalComponent } from './orders-cart-modal/orders-cart-modal.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ClientsComponent } from './clients/clients.component';
import { RoutesComponent } from './routes/routes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { SearchFamComponent } from './search-fam/search-fam.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    CatalogosComponent,
    CatalogoComponent,
    OrdersCartComponent,
    OrdersPlacedComponent,
    OrdersCartModalComponent,
    AddProductComponent,
    ClientsComponent,
    RoutesComponent,
    ProveedoresComponent,
    AlmacenesComponent,
    VendedoresComponent,
    SearchFamComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CatalogosRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    NgxImageCompressService
  ],

})
export class CatalogosModule { }
