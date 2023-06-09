import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '@core/guard/logged.guard';
import { UnloggedGuard } from '@core/guard/unlogged.guard';
import { CatalogoComponent } from '@presentation/features/catalogo/catalogo.component';
import { OrdersCartComponent } from '@presentation/features/orders-cart/orders-cart.component';
import { OrdersPlacedComponent } from '@presentation/features/orders-placed/orders-placed.component';
import { OrdersComponent } from '@presentation/features/orders/orders.component';
import { BaseAuthComponent } from '@presentation/layout/base-auth/base-auth.component';
import { BaseLoggedComponent } from '@presentation/layout/base-logged/base-logged.component';

const routes: Routes = [
  {
    path: 'auth',
    component: BaseAuthComponent,
    canActivate : [UnloggedGuard],
    children: [
      {
        path: 'login',
        loadChildren: () => 
          import('@presentation/features/auth/login/login.module').then(
            (m) => m.LoginModule
          ),
      }
    ]
  },
  {
    path: '',
    component: BaseLoggedComponent,
    canActivate : [LoggedGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => 
          import('@presentation/features/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: 'catalogo',
        component: CatalogoComponent
      },
      {
        path: 'pedidos',
        component: OrdersComponent
      },
      {
        path: 'pedidos-realizados',
        component: OrdersPlacedComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
