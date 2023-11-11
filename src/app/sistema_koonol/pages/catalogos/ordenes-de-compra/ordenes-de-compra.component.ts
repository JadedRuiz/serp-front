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
 public producto = new ProductProv('','',0,0,0);
 public ordenCompra = new OrdenDeCompra(0,'','','','','',0,0,'','');
 public proveedores: Proveedor[] = [];
 public provCtrl: FormControl;
 public provFiltrados: Observable<any[]>;
 @ViewChild('data') mytemplateForm : NgForm | undefined;

 constructor(

  private proveedor_service : ProveedoresService,
  private datePipe: DatePipe
) {
  this.provCtrl = new FormControl();
  this.provFiltrados = this.provCtrl.valueChanges
    .pipe(
      startWith(''),
      map(prov => prov ? this.filtrarProv(prov) : this.proveedores.slice())
    );
}


ngOnInit(): void {
  this.ordenCompra.fecha_creacion = new Date ().toISOString ().substring (0,10);
 this.obtenerProveedor();
//  console.log('fecha :>> ', this.ordenCompra.fecha_creacion);
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

provSelec(prov: any) {
 console.log('element :>> ', prov.option.id.proveedor);
this.ordenCompra.proveedor = prov.option.id.proveedor;
}

displayedColumns = ['producto', 'uMedida', 'cantidad', 'pUnitario', 'importe', 'acciones'];


transactions: Transaction[] = [
  {producto: 'Beach ball',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Towel',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Frisbee',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Sunscreen',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Cooler', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Coo33', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
];


getTotalCost(): number { return this.transactions.reduce((total, transaction) => total + transaction.importe, 0); }


editarItem(row: any) {
  this.producto = row;
  console.log('transaction :>> ', this.producto);

}



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


guardar(){
  Swal.fire({
    title: "¿Confirmar orden de compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Revizar',
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

vaciarOrden(){
  console.log('entro :>> ');
  this.ordenCompra = new OrdenDeCompra(0,'','','','','',0,0,'','');
  this.ordenCompra.fecha_creacion = new Date ().toISOString ().substring (0,10);


  console.log('fecha :>> ', this.ordenCompra.fecha_creacion);
}

}
