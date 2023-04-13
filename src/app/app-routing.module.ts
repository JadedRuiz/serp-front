import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '@core/guard/logged.guard';
import { UnloggedGuard } from '@core/guard/unlogged.guard';
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
