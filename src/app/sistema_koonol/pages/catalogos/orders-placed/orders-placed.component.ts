import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { Subscription, debounceTime } from 'rxjs';
import { ArticuloFinal } from 'src/app/models/articulofinal.model';
import { Client } from 'src/app/models/clients.model';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ClientsService } from 'src/app/services/clients/clients.service';


@Component({
   selector: 'app-orders-placed',
   templateUrl: './orders-placed.component.html',
   styleUrls: ['./orders-placed.component.scss']
})

export class OrdersPlacedComponent {
   modalVisibility: boolean = false
   orderVisibility: boolean = false
   editOrderVisibility: boolean = false
   pedidos: any[] = []
   articulosPedido: ArticuloFinal[] = []
   pedidoSeleccionado: any;
 dataStorage: any = JSON.parse(localStorage.getItem('dataPage')!)
miToken = this.dataStorage.token;   constructor(
      private pedidosRealizados: PedidosService,
      private clienteService: ClientsService,
   ) { }

   ngOnInit() {
     this.obtenerPedidos();
    this.searchClientControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe((value) => {
      this.buscarCliente(value);
    });
  }


   i= true;
   obtenerPedidos() {

      this.pedidosRealizados.obtenerPedidos().subscribe(
         (response) => {
            this.pedidos = response.data
         }
      )

   }

   seleccionarPedido(id_pedido: number) {
      this.pedidoSeleccionado = this.pedidos.find(pedidos => pedidos.id_pedido == id_pedido)
      console.log(this.pedidoSeleccionado);
      this.buscarPedido(id_pedido)
      this.toggleModalVisibility()
   }

   buscarPedido(id_pedido: number) {
      this.pedidosRealizados.buscarPedido(id_pedido).subscribe(
         (response) => {
            this.articulosPedido = response.data
         })
   }

   toggleModalVisibility() {
      this.modalVisibility = !this.modalVisibility
      this.orderVisibility = !this.orderVisibility
   }

   closeModal() {
      this.modalVisibility = false
      this.orderVisibility = false
      this.editOrderVisibility = false
   }

   openEditOrderVisibility() {
      this.editOrderVisibility = true
      this.orderVisibility = false
   }

   saveEditedOrder() {
      this.editOrderVisibility = false
      this.orderVisibility = true
   }

   //GENERAR PDF DE COTIZACIÓN
   @ViewChild('cotizacion', { static: false }) cotizacion!: ElementRef

   generarPdfCotizacion() {
      html2pdf()
      .set({
         margin: 1,
         filename: `Cotización para ${this.pedidoSeleccionado.cliente}.pdf`,
         html2canvas: {
            scale: 4,
            letterRendering: true
         },
         jsPDF: {
            unit: 'in',
            format: 'a3',
            orientation: 'portrait'
         }
      })
      .from(this.cotizacion.nativeElement).save()
   }



  //////PARA BUSCAR CLIENTES////////

  clients: Client[] = [];
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
      id_comprador: 1,
      cliente: '',
      token: this.miToken,

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
  }

}
