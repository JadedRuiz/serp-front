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
  constructor(private clientService: ClientsService) {}

  ngOnInit() {}

  clients: Client[] = [];
  addresses: Address[] = [];
  response: any = {}

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
    this.response,
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
    this.clientService.obtenerClientes().subscribe(
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

  obtenerDirecciones(id_cliente_direccion: number) {
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

  submit(clientForm: NgForm) {
    this.guardarCliente(clientForm).then(
      console.log(this.response),
      this.guardarDireccion(clientForm)
      )
    // if (this.id_cliente) {
    //   this.guardarDireccion(clientForm);
    
  }

  guardarCliente(clientForm: NgForm) {
    if (clientForm.invalid) {
      console.log('666');
      return;
    }
    if (this.client.id_cliente) {
      this.clientService
        .editarCliente(this.client.id_cliente, this.client)
        .subscribe((objeto) => {
          console.log(objeto);
        });
    } else {
      this.clientService.agregarCliente(this.client).subscribe((objeto) => {
        console.log(this.client);
        this.clientService.obtenerClientes();
        this.response = objeto;
        console.log(objeto);
        console.log(this.response);
      });
    }
    return this.response
  }

  guardarDireccion(addressForm: NgForm) {
    if (addressForm.invalid) {
      console.log('666');
      return;
    }
    if (this.address.id_direccion) {
      this.clientService
        .editarDireccion(this.address.id_direccion, this.address)
        .subscribe((objeto) => {
          console.log(objeto);
        });
    } else {
      this.clientService.agregarDireccion(this.address).subscribe((objeto) => {
        console.log(objeto);
        console.log(this.client);
        this.clientService.obtenerClientes();
        // console.log(clientForm.value);
      });
    }
  }

  searchClient: string = '';
  autocompleteClients: any[] = [];
  selectedClient: any[] = [];
  isClientSelected: boolean = false;
  addClientVisibility: boolean = false;
  searchList: boolean = false;

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

  seleccionarCliente(id_cliente: number, id_cliente_direccion: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.filter(
        (aclient) => aclient.id_cliente === id_cliente
      );
      this.isClientSelected = true;
      this.obtenerDirecciones(id_cliente_direccion);
      this.searchList = false;
    } else {
      this.selectedClient = [];
    }
  }

  toggleAddClientVisibility() {
    this.addClientVisibility = !this.addClientVisibility;
  }
}
