import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  fecha1 = new FormControl(new Date());
  fecha2 = new FormControl(new Date());
//  serializedDate = new FormControl((new Date()).toISOString());
constructor(
  private datePipe: DatePipe
) {}

ngOnInit(): void {
  this.fecha1 = new FormControl();
  this.fecha2 = new FormControl();


  console.log('>>', this.fecha1.value);

}

onFechaSeleccionada(event: any) {
  console.log('entra  :>> ');
  let fechaSeleccionada = event.value;
  console.log('fechaSeleccionada :>> ', fechaSeleccionada);
}


formatearFecha(){
  const fecha = this.fecha1.value;
    return this.datePipe.transform(fecha, 'dd-MM-yyyy');
}


displayedColumns = ['producto', 'uMedida', 'cantidad', 'pUnitario', 'importe', 'acciones'];
transactions: Transaction[] = [
  {producto: 'Beach ball',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Towel',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Frisbee',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Sunscreen',uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Cooler', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Coo33', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Coo22', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
  {producto: 'Swim suit', uMedida: 'string', cantidad: 33, pUnitario: 10, importe: 4},
];

/** Gets the total cost of all transactions. */
getTotalCost() {
  return this.transactions.map(t => t.importe).reduce((acc, value) => acc + value, 0);
}



editarItem(row: any) {
  console.log('transaction :>> ', row);
  // Lógica para editar el elemento
}

borrarItem(transaction: any) {
  // Lógica para borrar el elemento
}


}
