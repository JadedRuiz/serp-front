import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';
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
  token = localStorage.getItem("token");
  miComprador = 1;
  miToken = '';
  miPefil = 'ADMINISTRADOR';
  miUsuario = 1;
  searchProveedorControl: FormControl = new FormControl();

  constructor(
    private provService: ProveedoresService
  ) { }

  ngOnInit() {
    this.obtenerProveedor();
    this.searchProveedorControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarProveedor(value);
      });
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

  proveedores: Proveedor[] = []
  searchProveedor: any;
  filteredProveedor: any[] = []
  autocompleteProveedor: any[] = [];
  searchList: boolean = false;
  selectedProveedor: Proveedor[] = [];
  isProveedorSelected: boolean = false;
  loader: boolean = false;
  modalVisibility: boolean = false;
  noProveedor: boolean = false;
  domicilio: Address = new Address(0, 1, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1)
  proveedor: Proveedor = new Proveedor(0, 1, '012354SDSDS01', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);


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
  // ACTIVAR/DESACTIVAR VENDEDOR
  activarProveedor(id_proveedor: number, activo: number) {
    let json = {
      id_proveedor: 0,
      id_comprador: 1,
      proveedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    Swal.fire({
      title: '¿Quieres DESACTIVAR este proveedor?',
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.provService.activarProveedor(id_proveedor, activo).subscribe((objeto) => {
          this.provService.obtenerProveedores(json);
          console.log('prov=>', this.proveedor.activo);

        });
      } else if (result.isDenied) {
      }
    })
  }
  //Activo
  proveedorIsActive: boolean = false;
  updateProveedorStatus() {
    this.autocompleteProveedor.forEach(proveedor => {
      if (proveedor.activo === 1) {
        proveedor.vendedorIsActive = true;
      } else {
        proveedor.vendedorIsActive = false;
      }
    });
  }

  prueba() {
    this.domicilio = new Address(0, 1, 1, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 0)
    this.proveedor = new Proveedor(0, 1, '', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);
    this.editarProveedor();
    this.isProveedorSelected = false;
  }

  setearProveedor(response: any) {
    this.proveedores = []
    response.data.forEach((element: any) => {
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
  }

  //=>
  obtenerProveedor() {
    let json = {
      id_proveeedor: 0,
      id_comprador: 1,
      proveedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };

    this.provService.obtenerProveedores(json).subscribe(
      (response) => {
        //=> console.log('=>',response.data);
        if (response.ok) {
          this.setearProveedor(response)
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  //=>
  buscarProveedor(value: string) {
    let json = {
      id_proveedor: 0,
      id_comprador: 1,
      proveedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    }
    if (value.length <= 2) {
      this.autocompleteProveedor = [];
      this.searchList = false;
    } else {
      this.loader = true;
      this.searchList = true;
      this.provService.obtenerProveedores(json).subscribe(
        (resp) => {
          console.log('Ws=>', this.proveedores);
          if (resp.ok) {
            this.setearProveedor(resp)
            this.autocompleteProveedor = this.proveedores.filter((proveedor) =>
              proveedor.proveedor?.toLowerCase().includes(value.toLowerCase())
              || proveedor.contacto?.toLowerCase().includes(value.toLowerCase())
                || proveedor.nombre_comercial?.toLowerCase().includes(value.toLowerCase())
            );
            
            this.loader = false;
          }
        },
        (err) => {
          console.log(err);
          this.loader = false;
        }
      );
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

  guardarProveedor(proveedorForm: NgForm) {
    let json = {
      id_proveedor: 0,
      id_comprador: 1,
      proveedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    if (proveedorForm.invalid) {
      return;
    }
    if (this.proveedor.id_proveedor) {
      Swal.fire({
        title: '¿Quieres GUARDAR los cambios?',
        showDenyButton: true,
        confirmButtonText: 'SI',
        denyButtonText: `NO`,
      }).then((result) => {

        if (result.isConfirmed) {
          this.provService.editarProveedor(this.proveedor.id_proveedor, this.proveedor)
            .subscribe((objeto) => { });
          Swal.fire('Cambios Guardados', '', 'success')
          proveedorForm.resetForm()
          this.isProveedorSelected = false
          this.modificarProveedor();
          console.log("EDITAMOS ", this.proveedor);
        }
      })
    } else {
      this.provService.agregarProveedor(this.proveedor).subscribe((objeto) => {
        this.provService.obtenerProveedores(json);
      })
      console.log("GUARDAMOS ", this.proveedor);
      this.modificarProveedor();
      proveedorForm.resetForm()
      this.provService.obtenerProveedores(json);

    }
    //console.log(this.proveedor);
  }

}
