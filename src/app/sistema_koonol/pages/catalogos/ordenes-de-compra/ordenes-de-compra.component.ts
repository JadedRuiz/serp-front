import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ProductProv } from 'src/app/models/producto-proveedor';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra.model';
import Swal from 'sweetalert2';

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
  styleUrls: ['./ordenes-de-compra.component.scss']
})
export class OrdenesDeCompraComponent implements OnInit {
 public producto = new ProductProv('','',0,0,0);
 public ordenCompra = new OrdenDeCompra(0,'','','','','',0,0,'','');
constructor(
  private datePipe: DatePipe
) {}


ngOnInit(): void {

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

}
