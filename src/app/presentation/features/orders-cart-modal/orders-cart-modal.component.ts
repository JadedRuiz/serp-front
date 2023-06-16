import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

interface adress {
  id?: number,
  userId?: number,
  country?: string,
  state?: string,
  city?: string,
  colony?: string,
  street?: string,
  zipcode?: number
}
@Component({
  selector: 'app-orders-cart-modal',
  templateUrl: './orders-cart-modal.component.html',
  styleUrls: ['./orders-cart-modal.component.scss']
})

export class OrdersCartModalComponent {


  //MODAL BASE
  @Output() toggleModalVisibility = new EventEmitter()

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
  }

  //MODAL PARA SELECCIONAR UN CLIENTE
  //Estado para manipular la visibilidad del modal de seleccionar cliente
  selectClientModal: boolean = true

  keyword: string = 'name'
  clients: {}[] = [
    {
      id: 1,
      name: 'Juan Pérez López',
      RFC: 'PELJ850512ABC'
    },
    {
      id: 2,
      name: 'María García Ramírez',
      RFC: 'GARM900621XYZ'
    },
    {
      id: 3,
      name: 'Pedro López Hernández',
      RFC: 'LOHP880228LMN'
    },
    {
      id: 4,
      name: 'Laura Martínez Rodríguez',
      RFC: 'MARR750713IJK'
    },
    {
      id: 5,
      name: 'Carlos Rodríguez Sánchez',
      RFC: 'ROSS910430DEF'
    },
    {
      id: 6,
      name: 'Ana Sánchez González',
      RFC: 'SAGO850825GHI'
    },
    {
      id: 7,
      name: 'Luis González Ramírez',
      RFC: 'GORJ920527JKL'
    },
    {
      id: 8,
      name: 'Mónica Hernández Martínez',
      RFC: 'HEMA811124MNO'
    },
    {
      id: 9,
      name: 'Jorge Ramírez López',
      RFC: 'RALJ880409PQR'
    },
    {
      id: 10,
      name: 'Silvia Torres Sánchez',
      RFC: 'TOSS900602STU'
    },
    {
      id: 11,
      name: 'Alfonso Quintero Montenegro',
      RFC: 'QUMA470929F37'
    },
    {
      id: 12,
      name: 'Ulises Cuevas Pérez',
      RFC: 'CUPU800825569',
    },
    {
      id: 13,
      name: 'María Rodríguez López',
      RFC: 'ROLM900103ABC'
    },
    {
      id: 14,
      name: 'Pedro González Ramírez',
      RFC: 'GORP850225XYZ'
    },
    {
      id: 15,
      name: 'Laura Sánchez Martínez',
      RFC: 'SAML880511LMN'
    },
    {
      id: 16,
      name: 'Carlos Martínez Sánchez',
      RFC: 'MASC910712IJK'
    },
    {
      id: 17,
      name: 'Ana López Rodríguez',
      RFC: 'LORA830620DEF'
    }
  ]

  confirmClient() {
    this.selectClientModal = false
    this.selectAdressModal = true
  }

  //MODAL PARA SELECCIONAR UNA DIRECCIÓN
  //Estado para manipular la visibilidad del modal de seleccionar dirección
  selectAdressModal: boolean = false

  adressSelected: adress = {}

  adresses: adress[] = [
    {
      id: 0,
      userId: 0,
      country: 'México',
      state: 'Yucatán',
      city: 'Umán',
      colony: 'Umanos',
      street: '40, 730',
      zipcode: 94300
    },
    {
      id: 1,
      userId: 1,
      country: 'México',
      state: 'Yucatán',
      city: 'Mérida',
      colony: 'Caucel',
      street: '29c, 716-a',
      zipcode: 97314
    },
    {
      id: 2,
      userId: 2,
      country: 'México',
      state: 'Yucatán',
      city: 'Kanasín',
      colony: 'Kanasines',
      street: 'Calle 30, 512',
      zipcode: 97300
    },
    {
      id: 3,
      userId: 3,
      country: 'México',
      state: 'Yucatán',
      city: 'Kanasín',
      colony: 'Kanasines',
      street: 'Calle 66, 202',
      zipcode: 97300
    },
    {
      id: 4,
      userId: 4,
      country: 'México',
      state: 'Yucatán',
      city: 'Mérida',
      colony: 'Caucel',
      street: 'Calle 10, 109',
      zipcode: 97314
    },
  ]

  backToClientModal() {
    this.selectClientModal = true
    this.selectAdressModal = false
  }

  consoleLog() {
    console.warn(this.adressSelected)
  }

  //MODAL PARA CREAR UNA DIRECCIÓN
  ////Estado para manipular la visibilidad del modal de crear dirección
  createAdressModal: boolean = false
  newAdress: adress = {
  }

  openCreateAdress() {
    this.selectAdressModal = false
    this.createAdressModal = true
  }

  cancelCreateAdress() {
    this.selectAdressModal = true
    this.createAdressModal = false
  }

  createAdress(form: NgForm) {
    if (form.valid) {
      this.newAdress = {
        country: form.value.country,
        state: form.value.state,
        city: form.value.city,
        colony: form.value.colony,
        street: form.value.street,
        zipcode: form.value.zipcode
      };
      const newAddressCopy = { ...this.newAdress };
      this.adresses.push(newAddressCopy);
    }
    this.createAdressModal = false;
    this.selectAdressModal = true;
  }
}

