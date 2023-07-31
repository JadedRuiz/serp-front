import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogosComponent } from './catalogos.component';
import { AlmacenesComponent } from './almacenes/almacenes.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { AddProductComponent } from './add-product/add-product.component';
import { OrdersPlacedComponent } from './orders-placed/orders-placed.component';
import { ClientsComponent } from './clients/clients.component';
import { SearchFamComponent } from './familias/search-fam.component';
import { RoutesComponent } from './routes/routes.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { OrdenesDeCompraComponent } from './ordenes-de-compra/ordenes-de-compra.component';
import { VisitaClienteComponent } from './visita-cliente/visita-cliente.component';
import { CobranzaComponent } from './cobranza/cobranza.component';
import { VisitasComponent } from './visitas/visitas.component';


const routes: Routes = [
  {
    path: '',
    component: CatalogoComponent
  },
  {
    path: 'add-product/:id', component:AddProductComponent
  },
  {
    path: 'add-product',
    component: AddProductComponent
  },
  {
    path: 'pedidos-realizados',
    component: OrdersPlacedComponent
  },
  {
    path: 'ordenes',
    component: OrdenesDeCompraComponent
  },
  {
    path: 'clientes',
    component: ClientsComponent
  },
  {
    path: 'buscador',
    component: SearchFamComponent
  },
  {
    path: 'rutas',
    component: RoutesComponent
  },
  {
    path: 'prov',
    component: ProveedoresComponent
  },
  {
  path: 'almacen',
  component: AlmacenesComponent
  },
  {
    path: 'vendedores',
    component: VendedoresComponent
  },
  {
    path: 'visitas',
    component: VisitasComponent
  },
  {
    path: 'cobranza',
    component: CobranzaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
