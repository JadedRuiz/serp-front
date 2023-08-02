import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, NgForm } from '@angular/forms';
import { GeolocationService } from '../maps/services';
import { VisitasDTO } from 'src/app/models/visitas.model';
import { VisitasService } from 'src/app/services/visitas/visitas.service';

@Component({
  selector: 'app-visita-cliente',
  templateUrl: './visita-cliente.component.html',
  styleUrls: ['./visita-cliente.component.scss']
})
export class VisitaClienteComponent implements OnInit {


  // var
  ubicacionVendedor : any ;
  visita: VisitasDTO = new VisitasDTO(
    0,
    0,
    '',
    1,
    '',
    '',
    '',
    '',
    0,
    '',
    0,
    0
  );


constructor(
  private router: Router,
  private visitasService: VisitasService,
  private clienteService: ClientsService,
  private geolocationService: GeolocationService,
  private vendedorService: VendedoresService,

){}

  ngOnInit() {
    this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
  }



//=> GUARDAR VISITA
guardarVisita(visitasForm : NgForm){
  // let coords = this.geolocationService.userLocation
  // console.log("hola", coords);
  // this.visita.latitud = coords[1]
  this.visitasService.agregarVisitas(this.visita).subscribe((object)=>{
    console.log('visitasForm :>> ', this.visita);
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
      this.visita.id_vendedor = id_vendedor;
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
  clients:Client[]=[];
  searchClient: string = '';
  autocompleteClients: any[] = [];
  selectedClient: Client = new Client(0, 0, 1, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 0, 0, 0, 0, 0, 0, 1, 0);
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
      this.visita.id_cliente = id_cliente;
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


//FUNCION PARA GUARDAR UBICACIÓN
  // guardarUbi(){
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.ubicacionVendedor = {
  //         latitud: position.coords.latitude,
  //         longitud: position.coords.longitude
  //       };
  //       Swal.fire('Ubicacion guardada correctamete', '', 'success');
  //       console.log('ubi :>> ', this.ubicacionVendedor);
  //     },
  //     (error) => {
  //       console.log(error);
  //     });
  //   }
  // }


}
