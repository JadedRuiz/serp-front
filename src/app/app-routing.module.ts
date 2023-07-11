import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '@core/guard/logged.guard';
import { UnloggedGuard } from '@core/guard/unlogged.guard';
// import { AddProductComponent } from '@presentation/features/add-product/add-product.component';
// import { CatalogoComponent } from '@presentation/features/catalogo/catalogo.component';
// import { ClientsComponent } from '@presentation/features/clients/clients.component';
// import { OrdersCartComponent } from '@presentation/features/orders-cart/orders-cart.component';
// import { OrdersPlacedComponent } from '@presentation/features/orders-placed/orders-placed.component';
// import { RoutesComponent } from '@presentation/features/routes/routes.component';
// import { SearchFamComponent } from '@presentation/features/search-fam/search-fam.component';
// import { BaseAuthComponent } from '@presentation/layout/base-auth/base-auth.component';
// import { BaseLoggedComponent } from '@presentation/layout/base-logged/base-logged.component';

// import { ProveedoresComponent } from '@presentation/features/proveedores/proveedores.component';
// import { AlmacenesComponent } from '@presentation/features/almacenes/almacenes.component';
// import { VendedoresComponent } from '@presentation/features/vendedores/vendedores.component';
import { LoginComponent } from './login/login.component';
import { BaseLoggedComponent } from '@sistema_koonol/shared/base-logged/base-logged.component';


const routes: Routes = [
  {
    path : '',
    component : LoginComponent,
    canActivate: [UnloggedGuard]
  },
  {
    path: 'sis_koonol',
    component: BaseLoggedComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'catalogos',
        loadChildren: () =>
          import('@sistema_koonol/pages/catalogos/catalogos.module').then(
            (m) => m.CatalogosModule
          ),
      }
    ]
  },
  // {
  //   path: 'auth',
  //   component: BaseAuthComponent,
  //   canActivate: [UnloggedGuard],
  //   children: [
  //     {
  //       path: 'login',
  //       loadChildren: () =>
  //         import('@presentation/features/auth/login/login.module').then(
  //           (m) => m.LoginModule
  //         ),
  //     }
  //   ]
  // },

  // {
  //   path: '',
  //   component: BaseLoggedComponent,
  //    canActivate: [LoggedGuard],
  //   children: [
  //     {
  //       path: 'home',
  //       loadChildren: () =>
  //         import('@presentation/features/home/home.module').then(
  //           (m) => m.HomeModule
  //         ),
  //     },
  //     {
  //       path: 'hobuscadorme',
  //       loadChildren: () =>
  //         import('@presentation/features/search-fam/search-fam.module').then(
  //           (m) => m.SearchModule
  //         ),
  //     },
  //     {
  //       path: 'catalogo',
  //       component: CatalogoComponent
  //     },
  //     {
  //       path: 'add-product',
  //       component: AddProductComponent
  //     },
  //     {
  //       path: 'pedidos-realizados',
  //       component: OrdersPlacedComponent
  //     },
  //     {
  //       path: 'clientes',
  //       component: ClientsComponent
  //     },
  //     {
  //       path: 'buscador',
  //       component: SearchFamComponent
  //     },
  //     {
  //       path: 'rutas',
  //       component: RoutesComponent
  //     },
  //     {
  //       path: 'prov',
  //       component: ProveedoresComponent
  //     },
  //     {
  //     path: 'almacen',
  //     component: AlmacenesComponent
  //     },
  //     {
  //       path: 'vendedores',
  //       component: VendedoresComponent
  //     }
  //   ]
  // }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
