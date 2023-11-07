import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '@core/guard/logged.guard';
import { UnloggedGuard } from '@core/guard/unlogged.guard';
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

];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
