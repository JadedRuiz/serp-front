import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

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
    this.selectAddressModal = true
  }

  //MODAL PARA SELECCIONAR UNA DIRECCIÓN
  //Estado para manipular la visibilidad del modal de seleccionar dirección
  selectAddressModal: boolean = false

  addressSelected: Address = {}

  addresses: Address[] = [
    {
      idAddress: 0,
      name: 'Casa',
      street: 'Calle Principal',
      numInt: 0,
      numExt: 10,
      cross: 'Avenida Central',
      cross2: 'Avenida Norte',
      colony: 'Centro',
      city: 'Ciudad de México',
      municipality: 'Cuauhtémoc',
      state: 'Ciudad de México',
      zipcode: 12345,
      location: 'Residencial'
    },
    {
      idAddress: 1,
      name: 'Trabajo',
      street: 'Avenida Comercial',
      numExt: 20,
      numInt: 5,
      cross: 'Calle Industrial',
      cross2: 'Boulevard Tecnológico',
      colony: 'Industrial',
      city: 'Monterrey',
      municipality: 'Monterrey',
      state: 'Nuevo León',
      zipcode: 67890,
      location: 'Oficina'
    },
    {
      idAddress: 2,
      name: 'Vacaciones',
      street: 'Playa Paraíso',
      colony: 'Costa Azul',
      city: 'Cancún',
      municipality: 'Benito Juárez',
      state: 'Quintana Roo',
      zipcode: 54321,
      location: 'Frente al mar'
    },
    {
      idAddress: 3,
      name: 'Apartamento',
      street: 'Avenida Principal',
      numExt: 15,
      colony: 'Centro',
      city: 'Guadalajara',
      municipality: 'Guadalajara',
      state: 'Jalisco',
      zipcode: 98765,
      location: 'Residencial'
    },
    {
      idAddress: 4,
      name: 'Oficina',
      street: 'Calle Comercial',
      numExt: 8,
      cross: 'Avenida Industrial',
      colony: 'Industrial',
      city: 'Tijuana',
      municipality: 'Tijuana',
      state: 'Baja California',
      zipcode: 43210,
      location: 'Centro empresarial'
    },
    {
      idAddress: 5,
      name: 'Segunda Casa',
      street: 'Avenida Playa',
      numExt: 25,
      cross: 'Calle Marina',
      colony: 'Costa Dorada',
      city: 'Puerto Vallarta',
      municipality: 'Puerto Vallarta',
      state: 'Jalisco',
      zipcode: 13579,
      location: 'Vacacional'
    }
  ];

  backToClientModal() {
    this.selectClientModal = true
    this.selectAddressModal = false
  }

  //MODAL PARA CREAR UNA DIRECCIÓN
  ////Estado para manipular la visibilidad del modal de crear dirección
  createAddressModal: boolean = false
  newAddress: Address = {
  }

  openCreateAddress() {
    this.selectAddressModal = false
    this.createAddressModal = true
  }

  cancelCreateAddress() {
    this.selectAddressModal = true
    this.createAddressModal = false
  }

  createNewAddress(form: NgForm) {
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
      const newAdddressCopy = { ...this.newAddress };
      this.addresses.push(newAdddressCopy);
    }
    this.createAddressModal = false;
    this.selectAddressModal = true;
  }
}

