import { Component } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
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

  editarAlmacen() {
    this.provInputs.forEach(
      provInput => {
        provInput.nativeElement.disabled = false
        // console.log(provInput.nativeElement)
      }
    )
  }
  modificarAlmacen() {
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




almacen: Almacen = new Almacen(0, 1, '', 1, '','',0,'','','','','','','','',0,'');


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
      almacen.empresa.toLowerCase().includes(this.searchAlmacen.toLowerCase()) || almacen.almacen?.toLowerCase().includes(this.searchAlmacen.toLowerCase()) || almacen.numero_exterior?.toLowerCase().includes(this.searchAlmacen.toLowerCase())
    );
  }
}

seleccionarAlmacen(id_almacen: number) {
  if (id_almacen) {
    this.almacen = this.autocompleteAlmacen.filter(
      (almacen) => almacen.id_almacen === id_almacen
    )[0];
    this.isAlmacenSelected = true;
    this.searchList = false;
  } else {
    this.selectedAlmacen = [];
  }
}








}
