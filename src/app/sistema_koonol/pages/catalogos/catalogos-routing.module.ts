import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReglamentoComponent } from './reglamento/reglamento.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'reglamento',
    component: ReglamentoComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
