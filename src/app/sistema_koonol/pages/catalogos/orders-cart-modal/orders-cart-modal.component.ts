import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { GeolocationService } from '../maps/services';
import { Client } from 'src/app/models/clients.model';
import { Address } from 'src/app/models/addresses.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-orders-cart-modal',
  templateUrl: './orders-cart-modal.component.html',
  styleUrls: ['./orders-cart-modal.component.scss']
})

export class OrdersCartModalComponent {

  //DESPUÉS VENDRÁ DESDE ALGO QUE HARÁ JADED
  miComprador = 1;
  miToken = '';
  miPefil = 'ADMINISTRADOR';
  miUsuario = 1;

  //VARIABLES FUNDAMENTALES EN LA APLICACIÓN
  searchClientControl: FormControl = new FormControl();
  searchClientSubscription: Subscription = new Subscription
  clients: Client[] = []
  addresses: Address[] = [];
  coords: [number, number] = [0, 0]

  constructor(
    private clientService: ClientsService,
    private geolocationService: GeolocationService
  ) { }

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
  }

  //LLAMADA A LAS DIRECCIONES DE UN CLIENTE EN ESPECIAL
  obtenerDireccion(id_cliente: number) {
    this.clientService.obtenerDirecciones(id_cliente).subscribe(
      (response) => {
        if (response.ok) {
          this.addresses = response.data;
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  //MODAL BASE
  @Output() toggleModalVisibility = new EventEmitter()

  //MODAL PARA SELECCIONAR UN CLIENTE
  clienteVendedorModal: boolean = true
  searchListCliente: boolean = false
  loaderCliente: boolean = false
  noClients: boolean = false
  autocompleteClients: Client[] = []
  selectedClient: Client = new Client(0, 0, this.miComprador, this.miToken, '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.miUsuario, 1)
  isClientSelected: boolean = false
  addressSelected: Address = new Address(0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1);

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
  buscarCliente(value: string) {
    let json = {
      id_cliente: 0,
      id_comprador: this.miComprador,
      cliente: '',
      token: this.miToken,
    }
    if (value.length <= 3) {
      this.autocompleteClients = [];
      this.searchListCliente = false;
    } else {
      this.loaderCliente = true
      this.searchListCliente = true;
      this.clientService.obtenerClientes(json).subscribe(
        (resp) => {
          if (resp.ok) {
            this.clients = resp.data
            this.autocompleteClients = this.clients.filter((client) =>
              client.cliente.toLowerCase().includes(value.toLowerCase()) ||
              client.rfc?.toLowerCase().includes(value.toLowerCase())
            );
            console.log(this.autocompleteClients);
            this.loaderCliente = false
          }
        },
        (err) => {
          console.log(err)
          this.loaderCliente = false
        }
      );
    }
  }

  //FUNCIÓN PARA ESCOGER UN CLIENTE Y GUARDAR SU ID EN addressSelected
  seleccionarCliente(id_cliente: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.find(
        (aclient) => aclient.id_cliente === id_cliente
      )!;
      this.searchClientControl.setValue(this.selectedClient.cliente)
      this.isClientSelected = true;
      this.obtenerDireccion(id_cliente);
      this.searchListCliente = false;
      this.addressSelected.id_cliente = id_cliente;
      this.searchClientSubscription.unsubscribe();
    } else {
      return;
    }
  }

  onFocusClientSearch() {
    this.searchClientSubscription = this.searchClientControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe((value) => {
      this.buscarCliente(value);
    });
  }

  confirmClient() {
    this.clienteVendedorModal = false
    this.selectAddressModal = true
  }

  //MODAL PARA SELECCIONAR UNA DIRECCIÓN
  //Estado para manipular la visibilidad del modal de seleccionar dirección
  selectAddressModal: boolean = false

  backToClientModal() {
    this.clienteVendedorModal = true
    this.selectAddressModal = false
  }

}

