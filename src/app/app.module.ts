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
import { AddProductComponent } from './presentation/features/add-product/add-product.component';

@NgModule({
  declarations: [
    AppComponent,
    CatalogoComponent,
    AddProductComponent
    
   
  ],
  imports: [
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
