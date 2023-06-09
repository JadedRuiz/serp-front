import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { FormsModule } from '@angular/forms';
import { OrdersCartComponent } from './presentation/features/orders-cart/orders-cart.component';
import { OrdersComponent } from './presentation/features/orders/orders.component';
import { OrdersPlacedComponent } from './presentation/features/orders-placed/orders-placed.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { OrdersCartModalComponent } from './presentation/features/orders-cart-modal/orders-cart-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CatalogoComponent,
    OrdersCartComponent,
    OrdersComponent,
    OrdersPlacedComponent,
    OrdersCartModalComponent
  ],

  imports: [
    AutocompleteLibModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LayoutModule,
    CoreModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
