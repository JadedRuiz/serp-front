import { Component } from '@angular/core';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Address } from 'src/app/models/addresses.model';
import { adress_Almacen } from 'src/app/models/adress-almacen.model';
import { Almacen } from 'src/app/models/almacen.model';
import { AlmacenService } from 'src/app/services/almacenes/almacen.service';



@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.scss']
})
export class AlmacenesComponent {
  token = localStorage.getItem("token");
  miComprador = 1;
  miToken = '';
  miPefil = 'ADMINISTRADOR';
  miUsuario = 1;
  searchAlmacenControl: FormControl = new FormControl();

  constructor(
    private almaService: AlmacenService
  ) { }

  ngOnInit() {
    this.obtenerAlmacenes();
    this.searchAlmacenControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarAlmacen(value);
      });
  }

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  // =>funcion para que el boton de editar funcione
  estado = false
  editar() {
    if (this.estado) {
      this.estado = false;
      this.provInputs.forEach(
        provInput => {
          provInput.nativeElement.disabled = true

        })
    }
    else {
      this.estado = true;
      // this.editarAlmacen();
      this.provInputs.forEach(
        provInput => {
          provInput.nativeElement.disabled = false
        })
    }
  }
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
  loader: boolean = false
  noAlmacen: boolean = false


  domicilio: adress_Almacen = new adress_Almacen('', '', '', '', '', '', 0, '', '', '', '', '', '', 0);
  almacen: Almacen = new Almacen(0, 1, 0, 1,'','', '', '', 1, 1, this.domicilio);

  agregarNvoAlmacen() {
    this.domicilio = new adress_Almacen('', '', '', '', '', '', 0, '', '', '', '', '', '', 0);
    this.almacen = new Almacen(0, 1, 0, 1,'', '', '', '', 1, 1, this.domicilio);
    this.editarAlmacen();
    this.isAlmacenSelected = false;
  }

  setearAlmacen(response:any) {
    response.data.forEach((element: any) => {
      this.almacenes.push(new Almacen(
        element.id_almacen,
        1,
        element.id_direccion,
        1,
        element.empresa = 'Koonol',
        element.direccion,
        "012354SDSDS01",
        element.almacen,
        1,
        1,
        new adress_Almacen(
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
  }

  obtenerAlmacenes() {
    let json = {
      id_almacen: 0,
      id_comprador: 1,
      almacen: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.almaService.obtenerAlmacenes(json).subscribe(
      (response) => {
        //=> console.log('=>',response.data);
        if (response.ok) {
          this.setearAlmacen(response)
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  buscarAlmacen(value: string) {
    let json = {
      id_almacen: 0,
      id_comprador: 1,
      almacen: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    }
    if (value.length <= 3) {
      this.autocompleteAlmacen = [];
      this.searchList = false;
    } else {
      this.loader = true
      this.searchList = true;
      this.almaService.obtenerAlmacenes(json).subscribe(
        (resp) => {
          console.log('Ws=>',this.almacenes);
          if (resp.ok) {
            this.setearAlmacen(resp)
            this.autocompleteAlmacen = this.almacenes.filter((almacen) =>
            almacen.almacen.toLowerCase().includes(value.toLowerCase()) ||
            almacen.domicilio.descripcion?.toLowerCase().includes(value.toLowerCase())
            );
            this.loader = false
          }
        },
        (err) => {
          console.log(err)
          this.loader = false
        }
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
      this.almaService.editarAlmacen(this.almacen.id_almacen, this.almacen)
        .subscribe((objeto) => { });
      console.log("editamos");
      console.log(this.almacen);
    } else {
      this.almaService.agregarAlmacen(this.almacen).subscribe((objeto) => {
        this.almaService.obtenerAlmacenes(json);
      })
      console.log("guardamos");
      console.log(this.almacen);
      this.almaService.obtenerAlmacenes(json);
    }
    this.modificarAlmacen()
    console.log(this.almacen);
  }







}
