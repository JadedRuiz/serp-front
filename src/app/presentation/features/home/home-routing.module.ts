import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CatalogoComponent } from '../catalogo/catalogo.component';

const routes: Routes = [
  {
    path : '',
    component : CatalogoComponent
      },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
