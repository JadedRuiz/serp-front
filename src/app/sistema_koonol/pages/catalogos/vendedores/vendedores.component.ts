import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss'],
})
export class VendedoresComponent {
  constructor(private vendedorService: VendedoresService) {}


datastorage: any = JSON.parse(localStorage.getItem('dataPage')!);
miComprador = 1;
miToken = this.datastorage.token;
miPerfil = 'ADMINISTRADOR';
miUsuario = 1;


//Otras
vendedores: any[] = [];
searchVendedor: string = '';
autocompleteVendedor: any[] = [];
isVendedorSeleccionado: boolean = false;
vendedorSeleccionado: Vendedor[] = [];
searchList: boolean = false;
vendedor: Vendedor = new Vendedor(0, 1, '', '', 1, 1);
status: boolean = false;


@ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;


  ngOnInit() {
    this.obtenerVendedor();
  }




  //=> Obtener Vendedor
  obtenerVendedor() {
     let json = {
      id_vendedor: 0,
      id_comprador: this.miComprador,
      vendedor: '',
      solo_activos: 1,
      token: this.miToken,
    };
    this.vendedorService.obtenerVendedores(json).subscribe(
      (response) => {
        if (response.ok) {
          this.vendedores = response.data;
          this.autocompleteVendedor = this.vendedores;
          this.updateVendedorStatus();
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error',
          });
          //console.log(response.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Busca Vendedor =>
  buscarVendedor() {
     if (this.searchVendedor.length <= 1) {
      this.autocompleteVendedor = [];
    } else {
      this.searchList = true;
      this.obtenerVendedor;
      console.log(this.vendedores);
      this.autocompleteVendedor = this.vendedores.filter((vendedor) =>
        vendedor.vendedor
          .toLowerCase()
          .includes(this.searchVendedor.toLowerCase())
      );
      console.log(this.autocompleteVendedor);
    }
  }

  //Selecciona Vendedor =>
  selecionarVendedor(id_vendedor: number) {
    if (id_vendedor) {
      this.vendedor = this.autocompleteVendedor.filter(
        (vendedor) => vendedor.id_vendedor === id_vendedor
      )[0];
      this.isVendedorSeleccionado = true;
      this.searchList = false;
    } else {
      this.vendedorSeleccionado = [];
    }
  }

  //Activa campos para agregar nuevo Vendedor
  cargarCampos() {
    this.vendedor = new Vendedor(0, 1, '', '', 1, 1);
    this.activarCampos();
  }

  //Guarda Vendedor =>
  guardarVendedor(vendedorForm: NgForm) {
      if (vendedorForm.invalid) {
      return;
    }
    if (this.vendedor.id_vendedor) {
      this.vendedorService
        .editarVendedor(this.vendedor.id_vendedor, this.vendedor)
        .subscribe((objeto) => {});
      //console.log('editamos');
    } else {
      this.vendedorService
        .agregarVendedor(this.vendedor)
        .subscribe((objeto) => {
          this.obtenerVendedor;
        });
        vendedorForm.resetForm();
     // console.log('guardamos');
    }
  }

  // Activar/Desactivar Vendedor =>
  activarVendedor(id_vendedor: number, activo:number) {
      console.log(activo);
    let textoAlert = activo == 1 ? '¿Quieres DESACTIVAR este vendedor?' : '¿Quieres ACTIVAR este vendedor?'
    Swal.fire({
      title: textoAlert,
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.vendedorService.activarVendedor(id_vendedor, activo).subscribe((objeto) => {
         this.obtenerVendedor;

          // this.vendedorService.obtenerVendedores(json);
          console.log('vend=>', this.vendedor);
        });
      }
    })
  }

//Activo
vendedorIsActive: boolean = false;
updateVendedorStatus() {
  this.autocompleteVendedor.forEach(vendedor => {
    if (vendedor.activo === 1) {
      vendedor.vendedorIsActive = true;
    } else {
      vendedor.vendedorIsActive = false;
    }
  });
}



  getVendedorStatusClass(activo: number): string {
    return activo == 1 ? 'btn-success' : 'btn-danger';
  }

  getVendedorStatusText(activo: number): string {
    return activo == 1 ? 'ACTIVO' : 'DESACTIVADO';
  }


  //habilitar los comapos del input
  activarCampos() {
    this.provInputs.forEach((provInput) => {
      provInput.nativeElement.disabled = false;
    });
  }

  cambiarEstado() {
    if (this.status) {
      this.status = false;
    } else {
      this.status = true;
    }
  }

  section: number = 1;

  tab(section: number) {
    if (section === 1) {
      this.section = 1;
    } else if (section === 2) {
      this.section = 2;
    }
  }
}
