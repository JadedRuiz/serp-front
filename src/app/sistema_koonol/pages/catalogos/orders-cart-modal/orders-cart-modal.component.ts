import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { GeolocationService } from '../maps/services';
import { Client } from 'src/app/models/clients.model';
import { Address } from 'src/app/models/addresses.model';
import { Subscription, debounceTime } from 'rxjs';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';

@Component({
  selector: 'app-orders-cart-modal',
  templateUrl: './orders-cart-modal.component.html',
  styleUrls: ['./orders-cart-modal.component.scss']
})

export class OrdersCartModalComponent implements OnInit {

  //DESPUÉS VENDRÁ DESDE ALGO QUE HARÁ JADED
  miComprador = 1;
  vendedor = 0;
  miToken = '';
  miPefil = 'ADMINISTRADOR';
  miUsuario = 1;

  //VARIABLES FUNDAMENTALES EN LA APLICACIÓN
  //Autocomplete Cliente
  searchClientControl: FormControl = new FormControl();
  searchClientSubscription: Subscription = new Subscription
  clients: Client[] = []
  addresses: Address[] = [];
  //Autocomplete Vendedor
  searchSellerControl: FormControl = new FormControl();
  searchSellerSubscription: Subscription = new Subscription
  sellers: Vendedor[] = []
  //Coordenadas para la ubicación actual
  coords: [number, number] = [0, 0]
  

  constructor(
    private clientService: ClientsService,
    private vendedorService: VendedoresService,
    private geolocationService: GeolocationService
  ) { }

  ngOnInit(): void {
      if(this.vendedor !==0) {
        this.selectSellerVisibility = true
        this.isSellerSelected = true
      }
  }

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
  }

  //LLAMADA A LAS DIRECCIONES DE UN CLIENTE EN ESPECIAL
  obtenerDirecciones(id_cliente: number) {
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

  //Autocomplete Cliente
  searchListCliente: boolean = false
  loaderCliente: boolean = false
  noClients: boolean = false
  autocompleteClients: Client[] = []
  selectedClient: Client = new Client(0, 0, this.miComprador, this.miToken, '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.miUsuario, 1)
  isClientSelected: boolean = false
  addressSelected: Address = new Address(0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1);

  //Autocomplete Vendedor
  selectSellerVisibility: boolean = false
  searchListSeller: boolean = false
  loaderSeller: boolean = false
  autocompleteSellers: Vendedor[] = []
  selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0)
  isSellerSelected: boolean = false


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
    }
    else if (!this.searchClientSubscription.closed) {
      // console.log("Hola, se está haciendo una búsqueda: ", this.searchClientSubscription);
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
      this.obtenerDirecciones(id_cliente);
      this.searchListCliente = false;
      this.addressSelected.id_cliente = id_cliente;
      this.searchClientSubscription.unsubscribe();
      // console.log("Estás seleccionando un cliente: ", this.searchClientSubscription);
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
    // console.log("Estás sobre el input: ", this.searchClientSubscription);
  }

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE
  buscarVendedor(value: string) {
    if (value.length <= 3) {
      this.autocompleteSellers = [];
      this.searchListCliente = false;
    }
    else if (!this.searchSellerSubscription.closed) {
      this.loaderSeller = true
      this.searchListSeller = true;
      this.vendedorService.obtenerVendedores().subscribe(
        (resp) => {
          if (resp.ok) {
            this.sellers = resp.data
            this.autocompleteSellers = this.sellers.filter((seller) =>
              seller.vendedor.toLowerCase().includes(value.toLowerCase()));
            this.loaderSeller = false
          }
        },
        (err) => {
          console.log(err)
          this.loaderSeller = false
        }
      );
    }
  }

  seleccionarVendedor(id_vendedor:number) {
    if (id_vendedor) {
      this.selectedSeller = this.autocompleteSellers.find(
        (aSeller) => aSeller.id_vendedor === id_vendedor
      )!;
      this.searchSellerControl.setValue(this.selectedSeller.vendedor)
      this.isSellerSelected = true;
      this.searchListSeller = false;
      this.searchSellerSubscription.unsubscribe();
      // console.log("Estás seleccionando un cliente: ", this.searchClientSubscription);
    } else {
      return;
    }
  }

  onFocusSellerSearch() {
    this.searchSellerSubscription = this.searchSellerControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarVendedor(value);
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

