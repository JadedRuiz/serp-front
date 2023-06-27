import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})

export class AddClientComponent {

  constructor(
    private clientService: ClientsService
  ) { }

  clients: Client[] = []
  addresses: Address[] = []

  client: Client = new Client(0, 0, 1, '', '', '', '', '', '', '', 0, 0, 0, 0, 0, 0, 0, {
    id_direccion: 0,
    descripcion: '',
    calle: '',
    numero_interior: '',
    numero_exterior: '',
    cruzamiento_uno: '',
    cruzamiento_dos: '',
    codigo_postal: 0,
    colonia: '',
    localidad: '',
    municipio: '',
    estado: '',
    longitud: '',
    latitud: '',
    activo: 0,
  })

  guardarCliente(clientForm: NgForm) {
    if (clientForm.invalid) {
      return;
    }
    if (this.client.id_cliente) {
      this.clientService.editarCliente(this.client.id_cliente, this.client)
        .subscribe(objeto => {

        })
    } else {
      this.clientService.agregarCliente(this.client).subscribe(objeto => {
        console.log(objeto)
        this.clientService.obtenerClientes
        console.log(clientForm.value)
      })
    }
  }

}
