import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Client } from 'src/app/models/clients.model';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedorVisitas } from 'src/app/models/vendedorVisitas.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { VisitasService } from 'src/app/services/visitas/visitas.service';

@Component({
  selector: 'app-bitacora-visitas',
  templateUrl: './bitacora-visitas.component.html',
  styleUrls: ['./bitacora-visitas.component.scss']
})
export class BitacoraVisitasComponent implements OnInit {

  //LOCALSTORAGE
  dataStorage: any = JSON.parse(localStorage.getItem('dataPage')!)
  miToken = this.dataStorage.token;
  miUsuario = this.dataStorage.id_usuario;
  miAlmacen = this.dataStorage.id_almacen;

  miPefil = 'ADMINISTRADOR';
  miComprador = 1;

  constructor(
    private visitasService: VisitasService,
    private vendedoresService: VendedoresService
  ) { }

  ngOnInit(): void {
    this.obtenerBitacoraVisitas();
  }

  visitasDeVendedores: VendedorVisitas[] = [];
  visitasDeVendedor: VendedorVisitas = new VendedorVisitas(0, '', []);

  obtenerBitacoraVisitas(): void {
    let json = {
      id_visita: 0,
      id_vendedor: 0,
      id_cliente: 0,
      fecha_inicial: '2023/8/1',
      fecha_final: '2023/8/30',
      token: this.miToken,
    };
    this.visitasService.consultarBitacoraVisitas(json)
      .subscribe(resp => {
        this.visitasDeVendedores = resp.data
      }
      )
  }

  isMapVisible: boolean = false;
  toggleMapVisibility() {
    this.isMapVisible = !this.isMapVisible
  }

  //Autocomplete Vendedor
  searchSellerControl: FormControl = new FormControl();
  searchSellerSubscription: Subscription = new Subscription();
  sellers: Vendedor[] = [];
  selectSellerVisibility: boolean = false;
  searchListSeller: boolean = false;
  loaderSeller: boolean = false;
  autocompleteSellers: Vendedor[] = [];
  selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0);
  isSellerSelected: boolean = false;

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE
  buscarVendedor(value: string) {
    let json = {
      id_vendedor: 0,
      id_comprador: this.miComprador,
      vendedor: '',
      solo_activos: 1,
      token: this.miToken,
    };
    if (value.length <= 3) {
      this.autocompleteSellers = [];
      this.searchListSeller = false;
    } else if (!this.searchSellerSubscription.closed) {
      this.loaderSeller = true;
      this.searchListSeller = true;
      this.vendedoresService.obtenerVendedores(json).subscribe(
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
      this.selectedSeller = this.autocompleteSellers.find(
        (aSeller) => aSeller.id_vendedor === id_vendedor
      )!;
      this.searchSellerControl.setValue(this.selectedSeller.vendedor);
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

  fechaInicio: string = '';
  fechaFinal: string = '';

  formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${año}/${mes}/${dia}`;
  }

  calcularFechas() {
    if (this.fechaInicio === '') {
      const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.fechaInicio = this.formatearFecha(primerDiaMes);
    }

    if (this.fechaFinal === '') {
      const ultimoDiaMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      this.fechaFinal = this.formatearFecha(ultimoDiaMes);
    }
  }

}
