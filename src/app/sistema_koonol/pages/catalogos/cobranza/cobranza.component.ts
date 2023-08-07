import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, Subscription, catchError, debounceTime, throwError } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CobranzaDto } from 'src/app/models/cobranza.model';
import { CobranzaService } from 'src/app/services/cobranza/cobranza.service';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { Vendedor } from 'src/app/models/vendedor.model';
import * as $ from 'jquery';
import 'bootstrap';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss'],
})
export class CobranzaComponent implements OnInit {
  @ViewChild('cobranzaForm') cobranzaForm!: NgForm;
  //PEDIDOS
  pedidos: any = [];
  totalDinamico: number = 0;

  //var CALCULADORA
  b1000: number = 0;
  b500: number = 0;
  b200: number = 0;
  b100: number = 0;
  b50: number = 0;
  b20: number = 0;
  m10: number = 0;
  m5: number = 0;
  m2: number = 0;
  m1: number = 0;
  b1000Cambio: number = 0;
  b500Cambio: number = 0;
  b200Cambio: number = 0;
  b100Cambio: number = 0;
  b50Cambio: number = 0;
  b20Cambio: number = 0;
  m10Cambio: number = 0;
  m5Cambio: number = 0;
  m2Cambio: number = 0;
  m1Cambio: number = 0;
  totalIngresos: number = 0;
  totalCambio: number = 0;
  totalIngresosReal: number = 0;
  // Asegúrate de que la propiedad id_pedido está presente en tu objeto pedidoSeleccionado
  pedidoSeleccionado: any;

  // IDs
  vId = 0;
  cId = 0;

  cobranza: CobranzaDto = new CobranzaDto(
    0,
    1,
    0,
    '123',
    '',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1
  );

  //para paginador
  itemsPerPage = 4;
  p = 1;

  isModalOpen: boolean = false;
  modalBackdrop: any;

  constructor(
    private router: Router,
    private cobranzaService: CobranzaService,
    private pedidosRealizados: PedidosService,
    private pedidosPorPagar: PedidosService,
    private clienteService: ClientsService,
    private vendedorService: VendedoresService
  ) { }

  ngOnInit() {
    this.obtenerPedidos();
    this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
  }

  // GUARDAR COBRANZA
  guardar(cobranzaForm: NgForm) {
    this.cobranza.cambio_1000 = this.b1000Cambio || 0;
    this.cobranza.cambio_500 = this.b500Cambio || 0;
    this.cobranza.cambio_200 = this.b200Cambio || 0;
    this.cobranza.cambio_100 = this.b100Cambio || 0;
    this.cobranza.cambio_50 = this.b50Cambio || 0;
    this.cobranza.cambio_20 = this.b20Cambio || 0;
    this.cobranza.cambio_10 = this.m10Cambio || 0;
    this.cobranza.cambio_5 = this.m5Cambio || 0;
    this.cobranza.cambio_2 = this.m2Cambio || 0;
    this.cobranza.cambio_1 = this.m1Cambio || 0;
    this.cobranza.pago_1 = this.m1 || 0;
    this.cobranza.pago_2 = this.m2 || 0;
    this.cobranza.pago_5 = this.m5 || 0;
    this.cobranza.pago_10 = this.m10 || 0;
    this.cobranza.pago_20 = this.b20 || 0;
    this.cobranza.pago_50 = this.b50 || 0;
    this.cobranza.pago_100 = this.b100 || 0;
    this.cobranza.pago_200 = this.b200 || 0;
    this.cobranza.pago_500 = this.b500 || 0;
    this.cobranza.pago_1000 = this.b1000 || 0;
    this.cobranza.id_pedido = this.pId;
    this.cobranza.importe_pagado = this.totalIngresosReal;
    this.cobranzaService.guardarCobranza(this.cobranza).subscribe((object) => {
      this.calcular();
      console.log('this.cobranza :>> ', this.cobranza);
    });
  }

  //PEDIDOS POR COBRAR
  obtenerPedidos() {
    const json = {
      id_pedido: 0,
      id_cliente: this.cId,
      id_vendedor: this.vId,
      id_almacen: 1,
      id_usuario: 1,
      token: '123',
    };
    this.pedidosPorPagar.consultarPorPagar(json).subscribe((resp) => {
      this.pedidos = resp.data;
      console.log(resp);
      if (resp.ok) {
        return resp.data;
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: resp.message || 'Ha ocurrido un error',
        });
        return throwError(resp);
      }
    });
  }

  pId = 0;
  // Función para abrir el modal y establecer el pedido seleccionado
  abrirModalPago(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.pId = pedido.id_pedido;
    this.cobranzaForm.resetForm();
    this.totalDinamico = this.pedidoSeleccionado?.precio_total;
    this.isModalOpen = true;
    if (this.modalBackdrop) {
      this.modalBackdrop.style.display = 'flex';
    }
  }

  //Para la calculadora
  calcular() {
    this.totalIngresos =
      this.b1000 * 1000 +
      this.b500 * 500 +
      this.b200 * 200 +
      this.b100 * 100 +
      this.b50 * 50 +
      this.b20 * 20 +
      this.m10 * 10 +
      this.m5 * 5 +
      this.m2 * 2 +
      this.m1 * 1;

    this.totalCambio =
      this.b1000Cambio * 1000 +
      this.b500Cambio * 500 +
      this.b200Cambio * 200 +
      this.b100Cambio * 100 +
      this.b50Cambio * 50 +
      this.b20Cambio * 20 +
      this.m10Cambio * 10 +
      this.m5Cambio * 5 +
      this.m2Cambio * 2 +
      this.m1Cambio * 1;

    this.totalIngresosReal = this.totalIngresos - this.totalCambio;
    this.PrecioDinamico();
  }





  // Precio
  PrecioDinamico() {
    this.totalDinamico =
      this.pedidoSeleccionado?.importe_pedido - this.totalIngresosReal;
  }

  // =>MODAL

  closeModal() {
    this.modalBackdrop = document.querySelector('.modal-backdrop') as HTMLElement
    this.isModalOpen = false;
    $('#cobranzaForm').modal('hide');
    this.modalBackdrop.style.display = 'none';
  }

  cancelarOperacion() {
    Swal.fire({
      title: '¿Desea cancelar la operación?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#16c7ff',
      confirmButtonColor: '#D50901',
      confirmButtonText: 'Si, cancelar',
      cancelButtonText: 'Regresar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModal();
        Swal.fire('Cancelando...', 'Reiniciando calculadora', 'success');
      }
    });
  }

  //=> BUSCAR vendedor

  searchSellerControl: FormControl = new FormControl();
  searchSellerSubscription: Subscription = new Subscription();
  searchListSeller: boolean = false;
  loaderSeller: boolean = false;
  autocompleteSellers: Vendedor[] = [];
  isSellerSelected: boolean = false;
  sellers: Vendedor[] = [];
  selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0);

  //FUNCION PARA HACER BÚSQUEDA DE VENDEDORES
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
      this.selectedSeller = this.autocompleteSellers.find(
        (aSeller) => aSeller.id_vendedor === id_vendedor
      )!;
      this.vId = id_vendedor;
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

  //=>>> BUSCAR CLIENTE
  clients: Client[] = [];
  searchClient: string = '';
  autocompleteClients: any[] = [];
  selectedClient: Client = new Client(
    0,
    0,
    1,
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    ' ',
    0,
    0,
    0,
    0,
    0,
    1,
    0
  );
  searchClientSubscription: Subscription = new Subscription();
  isClientSelected: boolean = false;
  searchList: boolean = false;
  loader: boolean = false;
  noClients: boolean = false;
  searchClientControl: FormControl = new FormControl();

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
  buscarCliente(value: string) {
    let json = {
      id_cliente: 0,
      id_comprador: 1,
      cliente: '',
      token: '',
    };
    if (value.length <= 3) {
      this.autocompleteClients = [];
      this.searchList = false;
    } else if (!this.searchClientSubscription.closed) {
      this.loader = true;
      this.searchList = true;
      this.clienteService.obtenerClientes(json).subscribe(
        (resp) => {
          if (resp.ok) {
            this.clients = resp.data;
            this.autocompleteClients = this.clients.filter(
              (client) =>
                client.cliente.toLowerCase().includes(value.toLowerCase()) ||
                client.rfc?.toLowerCase().includes(value.toLowerCase())
            );
            console.log(this.autocompleteClients);
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

  //FUNCIÓN PARA ESCOGER UN CLIENTE Y GUARDAR SU ID EN addressSelected
  seleccionarCliente(id_cliente: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.find(
        (aclient) => aclient.id_cliente === id_cliente
      );
      this.cId = id_cliente;
      this.isClientSelected = true;
      this.searchList = false;
      this.searchClientControl.setValue(this.selectedClient.cliente);
      this.searchClientSubscription.unsubscribe();
    } else {
      return;
    }
  }

  //Función para que al dar clic en el input nos suscribamos a los cambios del mismo
  onFocusClientSearch() {
    this.searchClientSubscription = this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
    // console.log("Estás sobre el input: ", this.searchClientSubscription);
  }
}
