import { Component } from '@angular/core';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  modalVisibility: boolean = false
  
  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility
  }

  closeModal() {
    this.modalVisibility = false
  }


}
