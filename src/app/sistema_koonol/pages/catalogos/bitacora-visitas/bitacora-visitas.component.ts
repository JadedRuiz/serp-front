import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Client } from 'src/app/models/clients.model';
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
        console.log(resp);
      }
      )
  }

  isMapVisible: boolean = false;
  toggleMapVisibility() {
    this.isMapVisible = !this.isMapVisible
  }

}
