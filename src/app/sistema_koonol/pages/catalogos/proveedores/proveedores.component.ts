import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Proveedor } from 'src/app/models/proveedores.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent {

  constructor(
    private provService: ProveedoresService
  ) { }

  ngOnInit() {
    this.obtenerProveedor()
  }

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  proveedores: Proveedor[] = []
  searchProveedor: any;
  filteredProveedor: any[] = []
  autocompleteProveedor: any[] = [];
  searchList: boolean = false;
  selectedProveedor: Proveedor[] = [];
  isProveedorSelected: boolean = false;
  loader: boolean = false
  modalVisibility: boolean = false

  domicilio: Address = new Address(0, 1, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1)
  proveedor: Proveedor = new Proveedor(0, 1, '012354SDSDS01', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);



  //=>
  obtenerProveedor() {
    this.provService.obtenerProveedores().subscribe(
      (object: any) => {
        if (object.ok) {
          object.data.forEach((element: any) => {
            this.proveedores.push(new Proveedor(
              element.id_proveedor,
              1,
              "012354SDSDS01",
              element.proveedor,
              element.nombre_comercial,
              element.contacto,
              element.rfc,
              element.celular,
              element.telefono,
              element.correo,
              element.direcion,
              element.descuento1,
              element.descuento2,
              element.descuento3,
              1,
              1,
              new Address(
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
          console.log(this.proveedores);
          // this.proveedores = element.data;
        } else {
          console.log('Ocurrió un error', object.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error)
      }
    );
  }



  //=>
  buscarProveedor() {
    if (this.searchProveedor.length <= 2) {
      this.autocompleteProveedor = [];
    } else {
      this.searchList = true;
      this.provService.obtenerProveedores();
      this.autocompleteProveedor = this.proveedores.filter((proveedor) =>
        proveedor.proveedor.toLowerCase().includes(this.searchProveedor.toLowerCase())
        || proveedor.contacto?.toLowerCase().includes(this.searchProveedor.toLowerCase())
        || proveedor.nombre_comercial?.toLowerCase().includes(this.searchProveedor.toLowerCase())
      );
      console.log(this.proveedores.filter);
    }
  }

  //=>
  selecionarProveedor(id_proveedor: number) {

    // console.log(id_proveedor);
    if (id_proveedor) {
      this.proveedor = this.autocompleteProveedor.filter(
        (proveedor) => proveedor.id_proveedor === id_proveedor
      )[0];
      this.isProveedorSelected = true;
      this.searchList = false;
    } else {
      this.selectedProveedor = [];
    }
  }

  // =>
  // ACTIVAR/DESACTIVAR VENDEDOR
  activarProveedor(id_proveedor: number, activo: number) {
    Swal.fire({
      title: '¿Quieres DESACTIVAR este proveedor?',
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.provService.activarProveedor(id_proveedor, activo).subscribe((objeto) => {
          this.provService.obtenerProveedores();
          console.log('prov=>', this.proveedor.activo);

        });
      } else if (result.isDenied) {
      }
    })
  }


  prueba() {
    this.domicilio = new Address(0, 1, 1, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 0)
    this.proveedor = new Proveedor(0, 1, '', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);
    this.editarProveedor();
  }

  guardarProveedor(proveedorForm: NgForm) {
    if (proveedorForm.invalid) {
      return;
    }
    if (this.proveedor.id_proveedor) {
      this.provService.editarProveedor(this.proveedor.id_proveedor, this.proveedor)
        .subscribe((objeto) => { });
      console.log("editamos");
      //console.log(this.proveedor);
    } else {
      this.provService.agregarProveedor(this.proveedor).subscribe((objeto) => {
        this.provService.obtenerProveedores();
      })
      console.log("guardamos");
      //console.log(this.proveedor);
      this.provService.obtenerProveedores();
    }
    //console.log(this.proveedor);
  }

  editarProveedor() {
    this.provInputs.forEach(
      provInput => {
        provInput.nativeElement.disabled = false
        // console.log(provInput.nativeElement)
      }
    )
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



}
