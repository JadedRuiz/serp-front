import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LayoutModule } from '@presentation/layout/layout.module';
import { CoreModule } from '@core/core.module';
import { appEffects, appReducer } from '@domain/store';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CatalogoComponent } from './presentation/features/catalogo/catalogo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersCartComponent } from './presentation/features/orders-cart/orders-cart.component';
import { OrdersComponent } from './presentation/features/orders/orders.component';
import { OrdersPlacedComponent } from './presentation/features/orders-placed/orders-placed.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { OrdersCartModalComponent } from './presentation/features/orders-cart-modal/orders-cart-modal.component';
import { AddProductComponent } from '@presentation/features/add-product/add-product.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ClientsComponent } from '@presentation/features/clients/clients.component';
import { RoutesComponent } from './presentation/features/routes/routes.component';
import { ProveedoresComponent } from './presentation/features/proveedores/proveedores.component';



@NgModule({
  declarations: [
    AppComponent,
    CatalogoComponent,
    OrdersCartComponent,
    OrdersComponent,
    OrdersPlacedComponent,
    OrdersCartModalComponent,
    AddProductComponent,
    ClientsComponent,
    RoutesComponent,
    ProveedoresComponent
  ],


  imports: [
    AutocompleteLibModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    CoreModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [NgxImageCompressService,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
