import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Component,OnInit,ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CobranzaDto } from 'src/app/models/cobranza.model';
import { CobranzaService } from 'src/app/services/cobranza/cobranza.service';


@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss'],
})
export class CobranzaComponent implements OnInit{

  //PEDIDOS
  pedidos: any = [];


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
pedidoSeleccionado: any ;


cobranza : CobranzaDto = new CobranzaDto(
  0,0,0,'123','',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1);



  //para paginador
itemsPerPage =2;
p=1;

isModalOpen: boolean = false;


  constructor(
    private router: Router,
    private cobranzaService: CobranzaService,
    private pedidosRealizados: PedidosService,
  private clienteService: ClientsService,

    ) {}

  ngOnInit() {
    this.obtenerPedidos();
    this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
  }

// GUARDAR COBRANZA
guardar(cobranzaForm : NgForm) {
  this.calcular();
  this.cobranza.cambio_1000 = this.b1000Cambio
  this.cobranza.cambio_500 = this.b500Cambio
  this.cobranza.cambio_200 = this.b200Cambio
  this.cobranza.cambio_100 = this.b100Cambio
  this.cobranza.cambio_50 = this.b50Cambio
  this.cobranza.cambio_20 = this.b20Cambio
  this.cobranza.cambio_10 = this.m10Cambio
  this.cobranza.cambio_5 = this.m5Cambio
  this.cobranza.cambio_2 = this.m2Cambio
  this.cobranza.cambio_1 = this.m1Cambio
  this.cobranza.pago_1 = this.m1
  this.cobranza.pago_2 = this.m2
  this.cobranza.pago_5 = this.m5
  this.cobranza.pago_10 = this.m10
  this.cobranza.pago_20 = this.b20
  this.cobranza.pago_50 = this.b50
  this.cobranza.pago_100 = this.b100
  this.cobranza.pago_200 = this.b200
  this.cobranza.pago_500 = this.b500
  this.cobranza.pago_1000 = this.b1000
  this.cobranza.id_pedido = this.pId
  this.cobranza.importe_pagado = this.totalIngresosReal
  this.cobranzaService.guardarCobranza(this.cobranza).subscribe((object) => {
    console.log('this.cobranza :>> ', this.cobranza);});
}








  //Para obtener Pedidos
  obtenerPedidos() {
    this.pedidosRealizados.obtenerPedidos().subscribe((response) => {
      this.pedidos = response.data;
    });
  }


pId = 0;
 // Función para abrir el modal y establecer el pedido seleccionado
 abrirModalPago(pedido: any) {
  this.pedidoSeleccionado = pedido;
  this.pId = pedido.id_pedido;
  //console.log('pedido :>> ', pedido);
 this.openModal()

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
  }
// =>MODAL
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    console.log('closemodal :>>');
  }

cancelarOperacion(){
  Swal.fire({
    title: '¿Quieres cancelar la operación?',
    text: "Se reiniciara la calculadora",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, cancelar'
  }).then((result) => {
    if (result.isConfirmed){
      this.closeModal()

    }
  })
}


//=>>> BUSCAR CLIENTE
clients:Client[]=[];
searchClient: string = '';
autocompleteClients: any[] = [];
selectedClient: Client = new Client(0, 0, 1, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 0, 0, 0, 0, 0, 1, 0);
searchClientSubscription: Subscription = new Subscription();
isClientSelected: boolean = false;
searchList: boolean = false;
loader: boolean = false
noClients: boolean = false
searchClientControl: FormControl = new FormControl();


//FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
buscarCliente(value: string) {
  let json = {
    id_cliente: 0,
    id_comprador:1,
    cliente: '',
    token: '',
  }
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
    //this.visita.id_cliente = id_cliente;
    this.isClientSelected = true;
    this.searchList = false;
    this.searchClientControl.setValue(this.selectedClient.cliente)
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
