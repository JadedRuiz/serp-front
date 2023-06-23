import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent {

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  editarProveedor() {
    this.provInputs.forEach(
      provInput => {
        provInput.nativeElement.disabled = false
        // console.log(provInput.nativeElement)
      }
    )
}
modificarProveedor(){
  this.provInputs.forEach(
    provInput =>{
      provInput.nativeElement.disabled = true
      // console.log(provInput.nativeElement)
    }
    )
}
}
