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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchFamComponent } from './familias/search-fam.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OrdenesDeCompraComponent } from './ordenes-de-compra/ordenes-de-compra.component';
import { WebcamModule } from 'ngx-webcam';
import { VisitaClienteComponent } from './visita-cliente/visita-cliente.component';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { VisitasComponent } from './visitas/visitas.component';
import { DatePipe } from '@angular/common';
import { AddressesPhotosModalComponent } from './addresses-photos-modal/addresses-photos-modal.component';
import { CorteComponent } from './corte/corte.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './maps/maps.component';
import { PuntoDeVentaComponent } from './punto-de-venta/punto-de-venta.component';
import { BitacoraVisitasComponent } from './bitacora-visitas/bitacora-visitas.component';
import { MedidasComponent } from './medidas/medidas.component';
import { ControlVisitasComponent } from './control-visitas/control-visitas.component';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { UnidadMedidasComponent } from './unidad-medidas/unidad-medidas.component';
import {MatChipsModule} from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';





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
    SearchFamComponent,
    OrdenesDeCompraComponent,
    VisitaClienteComponent,
    CobranzaComponent,
    VisitasComponent,
    AddressesPhotosModalComponent,
    CorteComponent,
    UsuariosComponent,
    MapsComponent,
    PuntoDeVentaComponent,
    BitacoraVisitasComponent,
    MedidasComponent,
    ControlVisitasComponent,
    UnidadMedidasComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CatalogosRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    WebcamModule,
    NgxPaginationModule,
    GoogleMapsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTableModule
  ],
  providers: [
    NgxImageCompressService,
    DatePipe,

  ],

})
export class CatalogosModule { }
