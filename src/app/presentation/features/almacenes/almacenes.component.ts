import { Component } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Proveedor } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';
import { SERV_ALMACEN } from 'src/config/config';
import { Almacen } from 'src/app/models/almacen.model';
import { AlmacenService } from 'src/app/services/almacenes/almacen.service';



@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent {

  constructor(
    private almaService: AlmacenService
  ){}

  ngOnInit() {
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
  addresses: Address[] = []
  modalVisibility: boolean = false

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

   // =>





//Buscar ALMACEN
almacenes: Almacen[] = []
searchAlmacen: string = ''
filteredAlmacen: any[] = []
autocompleteAlmacen: any[] = [];
selectedAlmacen: Almacen[] = [];
searchList: boolean = false;
isAlmacenSelected: boolean = false;




almacen: Almacen = new Almacen(0, 1, '', 0, '');


obtenerAlmacenes(){
  let json = {
    id_almacen: 0,
    id_comprador: 1,
    almacen: '',
    solo_activos: 1,
    token: '012354SDSDS01',
  };
  this.almaService.obtenerAlmacenes(json).subscribe(
    (response) => {
      if (response.ok) {
        this.almacenes = response.data;
      } else {
        console.log('Ocurrió un error', response.message);
      }
    },
    (error) => {
      console.log('Error de conexión', error);
    }
  );
}

buscarAlmacen() {
  if (this.searchAlmacen.length <= 1) {
    this.autocompleteAlmacen = [];
  } else {
    this.searchList = true;
    this.obtenerAlmacenes();
    this.autocompleteAlmacen = this.almacenes.filter((almacen) =>
      almacen.almacen.toLowerCase().includes(this.searchAlmacen.toLowerCase())
    );
  }
}

seleccionarAlmacen(id_almacen: number) {
  if (id_almacen) {
    this.selectedAlmacen = this.autocompleteAlmacen.filter(
      (almacen) => almacen.id_almacen === id_almacen
    );
    this.isAlmacenSelected = true;
    this.searchList = false;
    this.tab(1);
  } else {
    this.selectedAlmacen = [];
  }
}





// obtenerProveedores() {
//   this.provService.obtenerProveedores().subscribe(
//     (response) => {
//       if (response.ok) {
//         this.proveedores = response.data;
//         console.log(this.proveedores)
//       } else {
//         console.log('Ocurrió un error', response.message);
//       }
//     },
//     (error) => {
//       console.log('Error de conexión', error)
//     }
//   );
// }

// guardarProveedor(proveedorForm: NgForm) {
//   if (proveedorForm.invalid) {
//     return;
//   }
//   if (this.proveedor.id_proveedor) {
//     this.provService.editarProveedor(this.proveedor.id_proveedor, this.proveedor)
//       .subscribe(objeto => { })
//   } else {
//     this.provService.agregarProveedor(this.proveedor).subscribe(objeto => {
//       console.log(objeto)
//       this.provService.obtenerProveedores
//       console.log(proveedorForm.value)
//     })
//   }
// }




}
