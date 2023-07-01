import { Component } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Proveedor } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent {

  constructor(
    private provService: ProveedoresService
  ){}

  ngOnInit() {
    this.obtenerProveedores()
  }

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

proveedores: Proveedor[] = []
addresses: Address[] = []
modalVisibility: boolean = false

proveedor: Proveedor = new Proveedor(0, 1, 0, '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, {
  id_cliente_direccion: 0,
  id_cliente: 0,
  id_direccion: 0,
  direccion: '',
  descripcion: '',
  calle: '',
  numero_interior: '',
  numero_exterior: '',
  cruzamiento_uno: '',
  cruzamiento_dos: '',
  codigo_postal: 0,
  colonia: '',
  localidad: '',
  municipio: '',
  estado: '',
  longitud: '',
  latitud: '',
  activo: 0,
})

toggleModalVisibility() {
  this.modalVisibility = !this.modalVisibility
}

closeModal() {
  this.modalVisibility = false
}

section: number = 1

tab(section: number) {
  if (section === 1) {
    this.section = 1
  } 
  else if (section === 2) {
    this.section = 2
  }
}


obtenerProveedores() {
  this.provService.obtenerProveedores().subscribe(
    (response) => {
      if (response.ok) {
        this.proveedores = response.data;
        console.log(this.proveedores)
      } else {
        console.log('Ocurrió un error', response.message);
      }
    },
    (error) => {
      console.log('Error de conexión', error)
    }
  );
}

guardarProveedor(proveedorForm: NgForm) {
  if (proveedorForm.invalid) {
    return;
  }
  if (this.proveedor.id_proveedor) {
    this.provService.editarProveedor(this.proveedor.id_proveedor, this.proveedor)
      .subscribe(objeto => { })
  } else {
    this.provService.agregarProveedor(this.proveedor).subscribe(objeto => {
      console.log(objeto)
      this.provService.obtenerProveedores
      console.log(proveedorForm.value)
    })
  }
}
searchProveedor: string = ''
filteredProveedor: any[] = []

buscarProveedor() {
  if (this.searchProveedor === '') {
    return;
  } 
  else {
    this.filteredProveedor = this.proveedores.filter((proveedor) =>
      proveedor.proveedor.toLowerCase().includes(this.searchProveedor.toLowerCase())
    );
  }
}

}
