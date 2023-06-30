import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { window } from 'rxjs';
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
  miToken = "";
  miPefil = "ADMINISTRADOR";
  miUsuario = 1;

  constructor(private clientService: ClientsService) { }

  ngOnInit() { }

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
      token: this.miToken
    }
    this.clientService.obtenerClientes(json).subscribe(
      (response) => {
        if (response.ok) {
          this.clients = response.data;
          console.log(this.clients);
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  obtenerDireccion(id_cliente_direccion: number) {
    this.clientService.obtenerDirecciones(id_cliente_direccion).subscribe(
      (response) => {
        if (response.ok) {
          this.addresses = response.data;
          console.log(this.addresses);
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  // submit(clientForm: NgForm) {
  //   this.guardarCliente(clientForm);
  // }

  editarCliente(cliente: any) {
    console.log(cliente)
  }

  editarDireccion(id_direccion: number) {
    console.log("Soy el objeto de la dirección que seleccionaste", this.addressSelected)
    this.addressSelected = this.addresses.filter(address => address.id_direccion == id_direccion)[0]
    this.addAddressVisibility = true
  }

  guardarCliente(clientForm: NgForm) {
    if (clientForm.invalid) {
      console.log('nada')
      return;
    }
    if (this.selectedClient.length > 0) {
      console.log(this.selectedClient)
      this.clientService
        .editarCliente(this.selectedClient[0].id_cliente, this.selectedClient[0])
        .subscribe((objeto) => {
          console.log(objeto);
          console.log(this.selectedClient[0])
        });
    } else {
      this.clientService.agregarCliente(this.client).subscribe((objeto) => {
        this.address.id_cliente = objeto.id_cliente;
        this.guardarDireccion(clientForm);
      });
    }
  }

  guardarDireccion(addressForm: NgForm) {
    console.log(this.addressSelected)
    //Ya lo validaste arriba
    if (this.addressSelected.id_cliente_direccion) {
      this.clientService
        .editarDireccion(this.addressSelected.id_direccion, this.addressSelected)
        .subscribe((objeto) => {
          console.log(objeto);
        });
    } else {
      this.clientService.agregarDireccion(this.address).subscribe((objeto) => {
        console.log(objeto);
        // this.buscarCliente();
        //this.clientService.obtenerClientes();
        // console.log(clientForm.value);
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
    0)

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
      console.log(this.selectedClient)
      this.isClientSelected = true;
      this.obtenerDireccion(id_cliente);
      this.searchList = false;
    } else {
      this.selectedClient = [];
    }
  }

  toggleAddAddressVisibility() {
    this.addAddressVisibility = !this.addAddressVisibility;
  }

  toggleIsClientSelected() {
    this.isClientSelected = !this.isClientSelected
    this.tab(1)
    this.toggleAddAddressVisibility()
  }

}

