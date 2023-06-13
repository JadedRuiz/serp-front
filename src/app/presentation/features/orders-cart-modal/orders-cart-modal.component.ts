import { Component, EventEmitter, Input, Output } from '@angular/core';

interface adress {
  id?: number,
  userId?: number,
  street?: string,
  city?: string
}

@Component({
  selector: 'app-orders-cart-modal',
  templateUrl: './orders-cart-modal.component.html',
  styleUrls: ['./orders-cart-modal.component.scss']
})

export class OrdersCartModalComponent {

  @Output() toggleModalVisibility = new EventEmitter()

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
  }

  //Estado para manejar si ya se seleccionó un cliente
  selectClientModal: boolean = true
  selectAdressModal: boolean = false
  createAdressModal: boolean = false

  confirmClient() {
    this.selectClientModal = false
    this.selectAdressModal = true
  }

  createAdress() {
    this.selectAdressModal = false
    this.createAdressModal = true
  }

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

  adressSelected: adress = {}

  adresses: adress[] = [
    {
      id: 1,
      userId: 1,
      street: 'Calle 29c, 716-a',
      city: 'Mérida'
    },
    {
      id: 2,
      userId: 2,
      street: 'Calle 30, 400',
      city: 'Mérida'
    },
    {
      id: 3,
      userId: 3,
      street: 'Calle 40, 512',
      city: 'Mérida'
    },
    {
      id: 4,
      userId: 2,
      street: 'Calle 30, 400',
      city: 'Mérida'
    },
    {
      id: 5,
      userId: 3,
      street: 'Calle 40, 512',
      city: 'Mérida'
    },
  ]

  consoleLog() {
    console.log(this.adressSelected)
  }

}
