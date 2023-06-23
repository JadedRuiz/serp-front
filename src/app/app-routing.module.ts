import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '@core/guard/logged.guard';
import { UnloggedGuard } from '@core/guard/unlogged.guard';
import { AddClientComponent } from '@presentation/features/add-client/add-client.component';
import { AddProductComponent } from '@presentation/features/add-product/add-product.component';
import { CatalogoComponent } from '@presentation/features/catalogo/catalogo.component';
import { ClientsComponent } from '@presentation/features/clients/clients.component';
import { OrdersCartComponent } from '@presentation/features/orders-cart/orders-cart.component';
import { OrdersPlacedComponent } from '@presentation/features/orders-placed/orders-placed.component';
import { OrdersComponent } from '@presentation/features/orders/orders.component';
import { RoutesComponent } from '@presentation/features/routes/routes.component';
import { SearchFamComponent } from '@presentation/features/search-fam/search-fam.component';
import { BaseAuthComponent } from '@presentation/layout/base-auth/base-auth.component';
import { BaseLoggedComponent } from '@presentation/layout/base-logged/base-logged.component';

import { EditarFamComponent } from '@presentation/features/search-fam/editar-fam/editar-fam.component';
import { ProveedoresComponent } from '@presentation/features/proveedores/proveedores.component';


const routes: Routes = [
  {
    path: 'auth',
    component: BaseAuthComponent,
    canActivate: [UnloggedGuard],
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
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@presentation/features/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: 'hobuscadorme',
        loadChildren: () =>
          import('@presentation/features/search-fam/search-fam.module').then(
            (m) => m.SearchModule
          ),
      },
      {
        path: 'catalogo',
        component: CatalogoComponent
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'pedidos',
        component: OrdersComponent
      },
      {
        path: 'pedidos-realizados',
        component: OrdersPlacedComponent
      },
      {
        path: 'clientes',
        component: ClientsComponent
      },
      {
        path: 'añadir-cliente',
        component: AddClientComponent
      },
      {
        path: 'buscador',
        component: SearchFamComponent
      },
      {
        path: 'editar-familia/:idFamilia',
        component: EditarFamComponent
      },
      {
        path: 'rutas',
        component: RoutesComponent
      },
      {
        path: 'prov',
        component: ProveedoresComponent
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
