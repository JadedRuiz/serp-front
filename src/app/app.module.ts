import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { LayoutModule } from '@presentation/layout/layout.module';
import { CoreModule } from '@core/core.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { CatalogoComponent } from './presentation/features/catalogo/catalogo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrdersCartComponent } from './presentation/features/orders-cart/orders-cart.component';
// import { OrdersPlacedComponent } from './presentation/features/orders-placed/orders-placed.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
// import { OrdersCartModalComponent } from './presentation/features/orders-cart-modal/orders-cart-modal.component';
// import { AddProductComponent } from '@presentation/features/add-product/add-product.component';
import { NgxImageCompressService } from 'ngx-image-compress';
// import { ClientsComponent } from '@presentation/features/clients/clients.component';
// import { RoutesComponent } from './presentation/features/routes/routes.component';
// import { ProveedoresComponent } from './presentation/features/proveedores/proveedores.component';
// import { AlmacenesComponent } from './presentation/features/almacenes/almacenes.component';
// import { MapsModule } from '@presentation/features/maps/maps.module';
// import { VendedoresComponent } from './presentation/features/vendedores/vendedores.component';
import { SistemaKoonolModule } from './sistema_koonol/sistema_koonol.module';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './ligaYuc/pages/inicio/inicio.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    // CatalogoComponent,
    // OrdersCartComponent,
    // OrdersPlacedComponent,
    // OrdersCartModalComponent,
    // AddProductComponent,
    // ClientsComponent,
    // RoutesComponent,
    // ProveedoresComponent,
    // AlmacenesComponent,
    // VendedoresComponent,
  ],


  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // AutocompleteLibModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SistemaKoonolModule,
    // MapsModule,
    ReactiveFormsModule,
    // LayoutModule,
    // CoreModule,
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
