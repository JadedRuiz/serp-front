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
    this.obtenerAlmacenes();
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
searchAlmacen: any;
filteredAlmacen: any[] = []
autocompleteAlmacen: any[] = [];
searchList: boolean = false;
selectedAlmacen: Almacen[] = [];
isAlmacenSelected: boolean = false;



domicilio: Address = new Address(0,1,0,'','','','','','','',0,'','','','','','',1)
almacen: Almacen = new Almacen(0, 1, 0, 1, '', '', '', 1, 1,this.domicilio);

agregarNvoAlmacen(){
  this.domicilio = new Address(0,1,1,'','','','','','','',0,'','','','','','',0)
  this.almacen = new Almacen(0, 1, 0, 1, '', '', '', 1, 1,this.domicilio);
  this.editarAlmacen();
}

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
        response.data.forEach((element : any) => {
          this.almacenes.push(new Almacen(
            element.id_almacen,
            1,
            element.id_direccion,
            1,
            element.empresa,
            "012354SDSDS01",
            element.almacen,
            1,
            1,
            new Address (
              element.id_cliente_direccion,
              element.number,
              element.id_direccion,
              element.direccion,
              element.descripcion,
              element.calle,
              element.numero_interior,
              element.numero_exterior,
              element.cruzamiento_uno,
              element.cruzamiento_dos,
              element.codigo_postal,
              element.colonia,
              element.localidad,
              element.municipio,
              element.estado,
              element.longitud = "longitud",
              element.latitud = "latitud",
              1
            )
          ))
        })
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
    let json = {
      id_almacen: 0,
      id_comprador: 1,
      almacen: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.searchList = true;
    this.almaService.obtenerAlmacenes(json)
    this.autocompleteAlmacen = this.almacenes.filter((almacen) =>
    almacen.empresa?.toLowerCase().includes(this.searchAlmacen.toLowerCase())  || almacen.almacen.toLowerCase().includes(this.searchAlmacen.toLowerCase()) 
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
    console.log(this.almacen);
  } else {
    this.selectedAlmacen = [];
  }
}
guardarAlmacen(almacenForm: NgForm) {
  let json = {
    id_almacen: 0,
    id_comprador: 1,
    almacen: '',
    solo_activos: 1,
    token: '012354SDSDS01',
  };
  if (almacenForm.invalid) {
    return;
  }
  if (this.almacen.id_almacen) {
    this.almaService.editarAlmacen(this.almacen.id_almacen,this.almacen)
    .subscribe((objeto) =>{});
    console.log("editamos");
    console.log(this.almacen);
  } else {
    this.almaService.agregarAlmacen(this.almacen).subscribe((objeto)=>{
      this.almaService.obtenerAlmacenes(json);
    })
    console.log("guardamos");
    console.log(this.almacen);
    this.almaService.obtenerAlmacenes(json);
  }
  console.log(this.almacen);
}







}
