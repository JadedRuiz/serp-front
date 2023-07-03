import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  //miComprador = window.sessionStorage["comprador_gl"];
  miComprador = 1;
  miToken = '';
  miPefil = 'ADMINISTRADOR';
  miUsuario = 1;

  constructor(private clientService: ClientsService) { }

  ngOnInit() { }

  //VARIABLES PARA CADA LLAMADA A LA API
  clients: Client[] = [];
  addresses: Address[] = [];

  //CLIENTE QUE SE UTILIZARÁ AL CREAR UNO NUEVO 
  client: Client = new Client(
    0,
    0,
    1,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    0,
    1
  );

  //DIRECCIÓN QUE SE UTILIZARÁ AL CREAR UN CLIENTE NUEVO
  address: Address = new Address(
    0,
    0,
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    1
  );

  //VARIABLE PARA DEFINIR LA SECCIÓN ACTUAL DE LAS TABS
  section: number = 1;

  //FUNCIÓN PARA ALTERNAR ENTRE TABS Y RESETEAR LA TAB ACTUAL EN CIERTOS CASOS
  tab(section: number) {
    if (section === 1) {
      this.section = 1;
    } else if (section === 2) {
      this.section = 2;
    }
  }


  //LLAMADA A LOS CLIENTES
  obtenerClientes() {
    let json = {
      id_cliente: 0,
      id_comprador: this.miComprador,
      cliente: '',
      token: this.miToken,
    };
    this.clientService.obtenerClientes(json).subscribe(
      (response) => {
        if (response.ok) {
          this.clients = response.data;
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
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

  //FUNCIÓN PARA SELECCIONAR LA DIRECCIÓN A EDITAR
  editarDireccion(id_cliente_direccion: number) {
    this.addressSelected = this.addresses.filter(
      (address) => address.id_cliente_direccion == id_cliente_direccion
    )[0];
    this.addAddressVisibility = true;
  }

  //FUNCIÓN PARA MANEJAR SI UN CLIENTE SE GUARDARÁ O SE EDITARÁ
  guardarCliente(clientForm: NgForm) {
    if (clientForm.invalid) {
      return;
    }
    if (this.selectedClient.length > 0) {
      this.clientService
        .editarCliente(
          this.selectedClient[0].id_cliente,
          this.selectedClient[0]
        )
        .subscribe((objeto) => { });
    } else {
      this.clientService.agregarCliente(this.client).subscribe((objeto) => {
        this.address.id_cliente = objeto.id_cliente;
        this.guardarDireccion(clientForm);
      });
    }
  }

  //FUNCIÓN PARA EDITAR UNA DIRECCIÓN, AÑADIR UNA DIRECCIÓN A UN CLIENTE EN ESPECÍFICO O CREARLA JUNTO A UN CLIENTE NUEVO
  guardarDireccion(addressForm: NgForm) {
    if (addressForm.invalid) {
      return;
    }
    //PARA EDITAR UNA DIRECCIÓN
    if (this.addressSelected.id_cliente && this.addressSelected.id_direccion) {
      this.clientService
        .editarDireccion(
          this.addressSelected.id_direccion,
          this.addressSelected
        )
        .subscribe((objeto) =>
          this.clientService.obtenerDirecciones(this.addressSelected.id_cliente)
        );
      this.offAddAddressVisibility();
    } 
    //PARA AGREGAR UNA DIRECCIÓN A UN CLIENTE YA EXISTENTE
    else if (this.addressSelected.id_cliente) {
      this.clientService
        .agregarDireccion(this.addressSelected)
        .subscribe((resp) => {
        });
    } 
    //PARA CREAR UNA DIRECCIÓN JUNTO A UN CLIENTE NUEVO
    else {
      this.clientService
        .agregarDireccion(this.address)
        .subscribe((resp) => {
        });
    }
  }


  //SECCIÓN PARA MANEJAR LA BÚSQUEDA DE CLIENTES Y LOS CLIENTES FILTRADOS
  searchClient: string = '';
  autocompleteClients: any[] = [];
  selectedClient: Client[] = [];
  isClientSelected: boolean = false;
  addAddressVisibility: boolean = false;
  searchList: boolean = false;
  addressSelected: Address = new Address(
    0,
    0,
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    1
  );

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE
  buscarCliente() {
    if (this.searchClient.length <= 3) {
      this.autocompleteClients = [];
    } else {
      this.searchList = true;
      this.obtenerClientes();
      this.autocompleteClients = this.clients.filter((client) =>
        client.cliente.toLowerCase().includes(this.searchClient.toLowerCase())
      );
    }
  }


  //FUNCIÓN PARA ESCOGER UN CLIENTE Y GUARDAR SU ID EN addressSelected
  seleccionarCliente(id_cliente: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.filter(
        (aclient) => aclient.id_cliente === id_cliente
      );
      this.isClientSelected = true;
      this.obtenerDireccion(id_cliente);
      this.searchList = false;
      this.addressSelected.id_cliente = id_cliente;
      this.tab(1);
    } else {
      this.selectedClient = [];
    }
  }

  //FUNCIÓN PARA DESHABILITAR LA VISTA DE CUANDO SE ESTÁ AÑADIENDO O EDITANDO UNA DIRECCIÓN Y REGRESAMOS A LA PÁGINA DE AÑADIR CLIENTE
  offAddAddressVisibility() {
    this.addAddressVisibility = false
  }


  //FUNCIÓN QUE SE UTILIZA PARA AÑADIR UN CLIENTE CUANDO YA ESTAMOS DENTRO DE UN CLIENTE ESPECÍFICO
  addClient() {
    this.selectedClient = []
    this.addressSelected = new Address(
      0,
      0,
      0,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      0,
      '',
      '',
      '',
      '',
      '',
      '',
      1)

    this.isClientSelected = false;
    this.tab(1);
    this.offAddAddressVisibility();
  }

  //FUNCIÓN PARA QUE AL QUERER AÑADIR UNA DIRECCIÓN A UN CLIENTE EXISTENTE, SE PASE EL ID DEL MISMO Y SE ABRA EL FORM
  createAddress() {
    this.addressSelected = new Address(
      0, this.selectedClient[0].id_cliente, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1)
    this.addAddressVisibility = true
  }
}
