import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Component,OnInit } from '@angular/core';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss'],
})
export class CobranzaComponent implements OnInit{
  //PEDIDOS
  pedidos: any = [];
  pedidoSeleccionado: any;
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


  //para paginador
itemsPerPage =2;
p=1;

  constructor(
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

  //Para obtener Pedidos
  obtenerPedidos() {
    this.pedidosRealizados.obtenerPedidos().subscribe((response) => {
      this.pedidos = response.data;
    });
  }

 // Función para abrir el modal y establecer el pedido seleccionado
 abrirModalPago(pedido: any) {
  this.pedidoSeleccionado = pedido;
  console.log('pedido :>> ', pedido);
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
