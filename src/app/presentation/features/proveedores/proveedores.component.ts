import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Proveedor } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent {

  constructor(
    private provService: ProveedoresService
  ){}

  ngOnInit() {
    this.obtenerProveedores()
  }

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  searchProveedor: string = ''
  filteredProveedor: any[] = []
  autocompleteProveedor: any[] = [];
  searchList: boolean = false;
  selectedProveedor: Proveedor [] = [];
  isProveedorSelected: boolean = false;


  proveedores: Proveedor[] = []
  modalVisibility: boolean = false

  addresses: Address = new Address(0,1,0,'','','','','','','',0,'','','','','','',0)
  proveedor: Proveedor = new Proveedor(0, 1, 0, '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0,this.addresses);


  
//=>
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



//=>
buscarProveedor() {
  if (this.searchProveedor.length <= 1) {
    this.autocompleteProveedor = [];
  } else {
    this.searchList = true;
    this.obtenerProveedores();
    this.autocompleteProveedor = this.proveedores.filter((proveedor) =>
      proveedor.proveedor.toLowerCase().includes(this.searchProveedor.toLowerCase())
    );
  }
}

//=>
selecionarProveedor(id_proveedor: number){
  if (id_proveedor){
    this.proveedor=this.autocompleteProveedor.filter(
      (proveedor) => proveedor.id_proveedor === id_proveedor
    )[0];
    this.isProveedorSelected = true;
    this.searchList = false;
  }else {
    this.selectedProveedor = [];
  }
}




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

}
