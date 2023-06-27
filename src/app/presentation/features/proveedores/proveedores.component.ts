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
  modificarProveedor() {
    this.provInputs.forEach(
      provInput => {
        provInput.nativeElement.disabled = true
        // console.log(provInput.nativeElement)
      }
    )
  }
  status = false
  cambiarEstado() {
    if (this.status) {
      this.status = false
    }
    else {
      this.status = true
    }
  }

  @ViewChildren('li') elementos!: QueryList<ElementRef>
  @ViewChildren('bloque') bloques!: QueryList<ElementRef>

  prueba() {
    this.elementos.forEach((elemento, i) => {
      this.elementos.forEach(elemento => {
        elemento.nativeElement.classList.remove('activo')
      })
      console.log(elemento)
      elemento.nativeElement.classList.add('activo')
    }
    )

    this.bloques.forEach(bloque => {
      this.bloques.forEach(bloque => {
        bloque.nativeElement.classList.remove('activo')
      })
      bloque.nativeElement.classList.add('activo')
    }
    )
  }

}
