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

  constructor(private clientService: ClientsService) {}

  ngOnInit() {}

  clients: Client[] = [];
  addresses: Address[] = [];

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
    0
  );

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
    0
  );

  section: number = 1;

  tab(section: number) {
    if (section === 1) {
      this.section = 1;
    } else if (section === 2) {
      this.section = 2;
    }
  }

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

  editarDireccion(id_cliente_direccion: number) {
    this.addressSelected = this.addresses.filter(
      (address) => address.id_cliente_direccion == id_cliente_direccion
    )[0];
    this.addAddressVisibility = true;
  }

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
        .subscribe((objeto) => {});
    } else {
      console.log(this.client)
      this.clientService.agregarCliente(this.client).subscribe((objeto) => {
        console.log(objeto)
        this.addressSelected.id_cliente = objeto.id_cliente;
        console.log(this.addressSelected)
        this.guardarDireccion(clientForm);
      });
    }
  }

  guardarDireccion(addressForm: NgForm) {
    if (addressForm.invalid) {
      return;
    }
    if (this.addressSelected.id_direccion) {
      this.clientService
        .editarDireccion(
          this.addressSelected.id_direccion,
          this.addressSelected
        )
        .subscribe((objeto) =>
          this.clientService.obtenerDirecciones(this.addressSelected.id_cliente)
        );
      this.offAddAddressVisibility();
    } else {
      this.clientService
        .agregarDireccion(this.addressSelected)
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
    0
  );

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

  onAddAddressVisibility() {
    this.addAddressVisibility = true
  }

  offAddAddressVisibility() {
    this.addAddressVisibility = false
  }

  addClient() {
    this.isClientSelected = false;
    this.tab(1);
    this.offAddAddressVisibility();
    // this.client = new Client(
    //   0,
    //   0,
    //   1,
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   0
    // );
    // this.address = new Address (
    //   0,
    //   0,
    //   0,
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   0,
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   '',
    //   0
    // )
  }
}
