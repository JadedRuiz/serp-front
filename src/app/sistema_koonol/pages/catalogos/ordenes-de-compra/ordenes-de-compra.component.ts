import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ProductProv } from 'src/app/models/producto-proveedor';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { Address } from 'src/app/models/addresses.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { Articulo } from 'src/app/models/articulo.model';





export interface Transaction {
  producto: string;
  uMedida: string;
  cantidad: number;
  pUnitario: number;
  importe: number;
}




@Component({
  selector: 'app-ordenes-de-compra',
  templateUrl: './ordenes-de-compra.component.html',
  styleUrls: ['./ordenes-de-compra.component.scss'],
})
export class OrdenesDeCompraComponent implements OnInit {
 public domicilio: Address = new Address(0, 1, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, [])
 public proveedor: Proveedor = new Proveedor(0, 1, '012354SDSDS01', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);
 public producto: Articulo = new Articulo(0,0,0,'','','',0,0,0,0,0,0,'',true,0,[],0,0,0,0,'');
 public ordenCompra = new OrdenDeCompra(0,'','','','','',0,0,'','');
 public proveedores: Proveedor[] = [];
 public provCtrl: FormControl;
 public provFiltrados: Observable<any[]>;
 public productos: Articulo[] = [];
 public productCtrl: FormControl;
 public productFiltrados: Observable<any[]>;
 public editando = false;
 displayedColumns = ['producto', 'uMedida', 'cantidad', 'pUnitario', 'importe', 'acciones'];
 @ViewChild('data') mytemplateForm : NgForm | undefined;

 constructor(

  private proveedor_service : ProveedoresService,
  private datePipe: DatePipe,
  private productService: CatalogoService
) {
  this.provCtrl = new FormControl();
  this.provFiltrados = this.provCtrl.valueChanges
    .pipe(
      startWith(''),
      map(prov => prov ? this.filtrarProv(prov) : this.proveedores.slice())
    );

  this.productCtrl = new FormControl();
  this.productFiltrados = this.productCtrl.valueChanges
    .pipe(
      startWith(''),
      map(product => product ? this.filtrarProduct(product) : this.productos.slice())
    );
}


ngOnInit(): void {
  this.values();
 this.obtenerProveedor();
 this.obtenerProductos2();
}


//VALORES POR DEFECTO
values(){
  this.ordenCompra.fecha_creacion = new Date ().toISOString ().substring (0,10);
  this.ordenCompra.forma_de_pago = 'CONTADO';
  this.ordenCompra.moneda = 'MXM';

}



// AUTO PROVEEDORES
obtenerProveedor() {
  let json = {
    id_proveeedor: 0,
    id_comprador: 1,
    proveedor: '',
    solo_activos: 1,
    token: '012354SDSDS01',
  };

  this.proveedor_service.obtenerProveedores(json).subscribe(
    (resp) => {
      if (resp.ok) {
        this.proveedores = resp.data
        console.log('resp :>> ', this.proveedores);
      }
    },
    (error) => {
      console.log('Error de conexión', error);
    }
  );
}
filtrarProv(name: any) {
  return this.proveedores.filter(prov =>
     prov.proveedor.toUpperCase().indexOf(name.toUpperCase()) === 0);
}
// PROV SELECCINADO
provSelec(prov: any) {
 console.log('element :>> ', prov.option.id.proveedor);
this.ordenCompra.proveedor = prov.option.id.proveedor;
}


//AUTO PRODUCTOS
obtenerProductos2(){
  let json = {
    id_existencia: 0,
    id_comprador: 1,
    articulo: '',
    token: '012354SDSDS01',
    id_almacen: 1,
  };
  this.productService.obtenerArticulos().subscribe((resp)=>{
    if(resp.ok){
      this.productos = resp.data
      console.log('resp :>> ', this.productos);
    }
  },
  (error) => {
    console.log('Error de conexión', error);
  }
  );
}

filtrarProduct(name:any){
  console.log('resp :>> ', name)
  return this.productos.filter(product =>
    product.articulo.toUpperCase().indexOf(name.toUpperCase()) === 0)
  }
productSelec(product:any){}






// DATOS DE MUESTRA
transactions: Transaction[] = [
  {producto: 'Beach ball',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Towel',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Frisbee',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Sunscreen',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Cooler', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Coo33', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
];

// PARA OBTENER EL TOTAL DE LA TABLA
getTotalCost(): number { return this.transactions.reduce((total, transaction) => total + transaction.importe, 0); }


//NUEVO PRODUCTO
agregarItem(){
  // this.producto = new ProductProv('','','',0,0,0);
  this.editando = false;

}

// EDITAR UN PRODUCTO
editarItem(row: any) {
  this.editando = true;
  this.producto = row;
  console.log('transaction :>> ', this.producto);
}



// BORRAR UN PRODUCTO DE LA LISTA
borrarItem(transaction: any) {
  Swal.fire({
    title: "¿Eliminar articulo",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "SI"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('transaction a eliminar: ', transaction);
      Swal.fire({
        title: "Articulo eliminado",
        icon: "success"
      });
    }
  });
}

// GUARDAR ORDEN DE COMPRA
guardar(){
  Swal.fire({
    title: "¿Confirmar orden de compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Revisar',
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('this.ordenDeCompra :>> ', this.ordenCompra);
      // this.mytemplateForm!.reset();
      this.vaciarOrden();
      Swal.fire({
        title: "Orden de compra confirmada",
        icon: "success"
      });
    }
  });
}

// CANCELAR ORDEN DE COMPRA
cancelar(){
  Swal.fire({
    title: "¿Cancelar orden de compra?",
    text: "se borraran todos los datos ingresados...",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Regresar',
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('this.ordenDeCompra :>> ', this.ordenCompra);
      Swal.fire({
        title: "Orden de compra cancelada",
        icon: "success"
      });
    }
  });
}

// VACIAR ORDEN
vaciarOrden(){
  this.ordenCompra = new OrdenDeCompra(0,'','','','','',0,0,'','');
  this.ordenCompra.fecha_creacion = new Date ().toISOString ().substring (0,10);
}

}
