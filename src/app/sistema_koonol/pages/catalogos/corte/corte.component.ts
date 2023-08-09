import { Component,OnInit } from '@angular/core';
import { FormControl,NgForm } from '@angular/forms';
import { Subscription,debounceTime } from 'rxjs';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { CobranzaService } from 'src/app/services/cobranza/cobranza.service';
import { CobranzaDto } from 'src/app/models/cobranza.model';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
@Component({
  selector: 'app-corte',
  templateUrl: './corte.component.html',
  styleUrls: ['./corte.component.scss']
})
export class CorteComponent implements OnInit {

// Variables
cId = 0;
fechaInicio:string = '2023/08/01';
fechaFinal:string = '2023/08/30';

constructor(
  private vendedorService: VendedoresService,
  private cobranzaService: CobranzaService,
  private clienteService: ClientsService,

){}


ngOnInit() {

this.consultarCobranza();

  this.searchSellerSubscription = this.searchSellerControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarVendedor(value);

      });
}



cobranzas : CobranzaDto[] = [];
// CONSULTAR COBRANZAS
consultarCobranza(){
  const json = {
    id_cobranza: 0,
    id_comprador: 1,
    id_cliente: this.cId,
    fecha_inicial: this.fechaInicio,
    fecha_final: this.fechaFinal,
    token: "123"
}

this.cobranzaService.consultarCobranza(json).subscribe(resp => {
  this.cobranzas = resp.data;
  console.log('resp.data :>> ', json);
})

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



 //////---BUSCAR CLIENTES---///////

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


 //MODAL=>
 cobranzaSeleccionada: any;
 abrirModalDetallesCobranza(cobranza: any) {
  this.cobranzaSeleccionada = cobranza;
  $('#detalleCobranzaModal').modal('show');
}

cerrarModal() {
  $('#detalleCobranzaModal').modal('hide');
}


//TOTALES

pagosTotal(): number {
  return this.cobranzaSeleccionada.pago_1000 * 1000 +
         this.cobranzaSeleccionada.pago_500 * 500+
         this.cobranzaSeleccionada.pago_200 * 200+
         this.cobranzaSeleccionada.pago_100 * 100+
         this.cobranzaSeleccionada.pago_50 * 50+
         this.cobranzaSeleccionada.pago_20 * 20+
         this.cobranzaSeleccionada.pago_10 * 10+
         this.cobranzaSeleccionada.pago_5 * 5+
         this.cobranzaSeleccionada.pago_2 * 2+
         this.cobranzaSeleccionada.pago_1 * 1;
}


cambioTotal(): number {
  return this.cobranzaSeleccionada.cambio_1000 * 1000 +
         this.cobranzaSeleccionada.cambio_500 * 500+
         this.cobranzaSeleccionada.cambio_200 * 200+
         this.cobranzaSeleccionada.cambio_100 * 100+
         this.cobranzaSeleccionada.cambio_50 * 50+
         this.cobranzaSeleccionada.cambio_20 * 20+
         this.cobranzaSeleccionada.cambio_10 * 10+
         this.cobranzaSeleccionada.cambio_5 * 5+
         this.cobranzaSeleccionada.cambio_2 * 2+
         this.cobranzaSeleccionada.cambio_1 * 1;

}
}
