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
import { CorteComponent } from './corte/corte.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MapsComponent } from './maps/maps.component';
import { PuntoDeVentaComponent } from './punto-de-venta/punto-de-venta.component';
import { BitacoraVisitasComponent } from './bitacora-visitas/bitacora-visitas.component';
import { MedidasComponent } from './medidas/medidas.component';
import { ControlVisitasComponent } from './control-visitas/control-visitas.component';
import { UnidadMedidasComponent } from './unidad-medidas/unidad-medidas.component';


const routes: Routes = [
  {
    path: '',
    component: CatalogoComponent
  },
  {
    path: 'articulos',
    component: CatalogoComponent
  },
  {
    path: 'add-product/:id',
    component:AddProductComponent
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
    path: 'familias',
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
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'visitas',
    component: VisitasComponent
  },
  {
    path: 'nueva-visita',
    component: VisitaClienteComponent
  },
  {
    path: 'cobranza',
    component: CobranzaComponent
  },
  {
    path: 'corte',
    component: CorteComponent
  },
  {
    path: 'maps',
    component: MapsComponent
  },
  {
    path: 'ventas',
    component: PuntoDeVentaComponent
  },
  {
    path: 'bitacora-visitas',
    component: BitacoraVisitasComponent
  },
  {
    path: 'control-visitas',
    component: ControlVisitasComponent
  },
  {
    path: 'unidad-medidas',
    component: UnidadMedidasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
