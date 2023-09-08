import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { FormControl, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss'],
})
export class VendedoresComponent {
  constructor(private vendedorService: VendedoresService) { }


  datastorage: any = JSON.parse(localStorage.getItem('dataPage')!);
  miComprador = 1;
  miToken = this.datastorage.token;
  miPerfil = 'ADMINISTRADOR';
  miUsuario = 1;


  //Otras
  vendedores: any[] = [];
  autocompleteVendedor: any[] = [];
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
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error',
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Autocomplete Vendedor
  searchSellerControl: FormControl = new FormControl();
  searchSellerSubscription: Subscription = new Subscription();
  searchListSeller: boolean = false;
  loaderSeller: boolean = false;
  autocompleteSellers: Vendedor[] = [];
  isSellerSelected: boolean = false;
  sellers: Vendedor[] = [];

  //FUNCION PARA HACER BÚSQUEDA DE VENDEDOR POR NOMBRE
  buscarVendedor(value: string) {
    let json = {
      id_vendedor: 0,
      id_comprador: 1,
      vendedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    if (value.length <= 3) {
      this.autocompleteSellers = [];
      this.searchListSeller = false;
    } else if (!this.searchSellerSubscription.closed) {
      this.loaderSeller = true;
      this.searchListSeller = true;
      this.vendedorService.obtenerVendedores(json).subscribe(
        (resp) => {
          if (resp.ok) {
            this.sellers = resp.data;
            this.autocompleteSellers = this.sellers.filter((seller) =>
              seller.vendedor.toLowerCase().includes(value.toLowerCase())
            );
            this.loaderSeller = false;
          }
        },
        (err) => {
          console.log(err);
          this.loaderSeller = false;
        }
      );
    }
  }

  //FUNCIÓN PARA ESCOGER UN VENDEDOR
  seleccionarVendedor(id_vendedor: number) {
    if (id_vendedor) {
      this.vendedor = this.autocompleteSellers.find(
        (aSeller) => aSeller.id_vendedor === id_vendedor
      )!;
      this.searchSellerControl.setValue(this.vendedor.vendedor);
      this.isSellerSelected = true;
      this.searchListSeller = false;
      this.searchSellerSubscription.unsubscribe();
    } else {
      return;
    }
  }

  //Función para que al dar clic en el input nos suscribamos a los cambios del mismo
  onFocusSellerSearch() {
    this.searchSellerSubscription = this.searchSellerControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarVendedor(value);
      });
  }

  //Activa campos para agregar nuevo Vendedor
  cargarCampos() {
    this.vendedor = new Vendedor(0, 1, '', '', 1, 1,'',0);
    this.searchSellerControl.setValue('');
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
        .subscribe((objeto) => { });
    } else {
      this.vendedorService
        .agregarVendedor(this.vendedor)
        .subscribe((objeto) => {
          this.obtenerVendedor;
        });
      vendedorForm.resetForm();
    }
  }

  // Activar/Desactivar Vendedor =>
  activarVendedor(id_vendedor: number, activo: number) {
    let textoAlert = activo == 1 ? '¿Quieres DESACTIVAR este vendedor?' : '¿Quieres ACTIVAR este vendedor?'
    Swal.fire({
      title: textoAlert,
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.vendedorService.activarVendedor(id_vendedor, activo).subscribe((objeto) => {
          this.obtenerVendedor();
        });
      }
    })
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
