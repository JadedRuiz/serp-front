import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Client {
  idClient?: number,
  clientKey?: string,
  client?: string,
  rfc?: string,
  commercialName?: string,
  discounts?: string,
  idRoute?: string,
}

interface Address {
  idAddress?: number,
  name?: string,
  street?: string,
  numInt?: number,
  numExt?: number,
  cross?: string,
  cross2?: string,
  colony?: string,
  city?: string,
  municipality?: string,
  state?: string,
  zipcode?: number,
  location?: string
}


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})

export class AddClientComponent {
  newClient: Client = {}
  newAddress: Address = {}
  clients: Client[] = []
  addresses: Address[] = []

  createNewClient(form: NgForm) {
    if (form.valid) {
      this.newClient = {
        clientKey: form.value.clientKey,
        client: form.value.client,
        rfc: form.value.rfc,
        commercialName: form.value.commercialName,
        discounts: form.value.discounts
      };
      const newClientCopy = { ...this.newClient }
      this.clients.push(newClientCopy)
    }

  }
  createNewAddres(form: NgForm) {
    if (form.valid) {
      this.newAddress = {
        name: form.value.name,
        street: form.value.street,
        numInt: form.value.numInt,
        numExt: form.value.numExt,
        cross: form.value.cross,
        cross2: form.value.cross2,
        colony: form.value.colony,
        city: form.value.city,
        municipality: form.value.municipality,
        state: form.value.state,
        zipcode: form.value.zipcode,
        location: form.value.location
      };
      const newAddressCopy = { ...this.newAddress }
      this.addresses.push(newAddressCopy)
    } 
  }

  onSubmitForm(form: NgForm) {
    this.createNewAddres(form)
    this.createNewClient(form)
    console.log(this.clients)
    console.log(this.addresses)
  }
}
