import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  constructor(
    private clientService: ClientsService
  ) { }

  ngOnInit() {
    this.obtenerClientes()
  }

  clients: Client[] = []
  addresses: Address[] = []
  modalVisibility: boolean = false

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

  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility
  }

  closeModal() {
    this.modalVisibility = false
  }

  section: number = 1

  tab(section: number) {
    if (section === 1) {
      this.section = 1
    } 
    else if (section === 2) {
      this.section = 2
    }
  }


  obtenerClientes() {
    this.clientService.obtenerClientes().subscribe(
      (response) => {
        if (response.ok) {
          this.clients = response.data;
          console.log(this.clients)
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error)
      }
    );
  }

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
