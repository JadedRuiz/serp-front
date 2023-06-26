import { Component } from '@angular/core';
import { ClientsService } from '@data/services/clients/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  constructor(
    private clientService: ClientsService
  ) 
  {}

    ngOnInit() {
      this.obtenerRutas()
    }

  clients:any[] = []
  modalVisibility: boolean = false
  
  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility
  }

  closeModal() {
    this.modalVisibility = false
  }


  obtenerRutas() {
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

}
