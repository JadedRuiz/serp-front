import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { GeolocationService } from '../maps/services';

@Component({
  selector: 'app-visita-cliente',
  templateUrl: './visita-cliente.component.html',
  styleUrls: ['./visita-cliente.component.scss']
})
export class VisitaClienteComponent implements OnInit {


  //Ubicacion var
  ubicacionVendedor : any ;

constructor(
  private router: Router,
  private clienteService: ClientsService,
  private geolocationService: GeolocationService,
){}

  ngOnInit() {
    this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
  }

//=>>>
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
  guardarUbi(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        this.ubicacionVendedor = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude
        };
        Swal.fire('Ubicacion guardada correctamete', '', 'success');
        console.log('ubi :>> ', this.ubicacionVendedor);
      },
      (error) => {
        console.log(error);
      });
    }
  }


}
