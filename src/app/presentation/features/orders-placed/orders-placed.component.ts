import { Component } from '@angular/core';

interface item {
  id?: number,
  imageUrl?: string,
  title?: string,
  fam?: string,
  description?: string,
  price?: any,
  quantity?: any
}


@Component({
  selector: 'app-orders-placed',
  templateUrl: './orders-placed.component.html',
  styleUrls: ['./orders-placed.component.scss']
})

export class OrdersPlacedComponent {
  items: item[] = [
    {
      id: 1,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Platanos',
      fam: 'Frutas',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '14.00',
      quantity: 1
    },
    {
      id: 2,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Panela',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '17.00',
      quantity: 1
    },
    {
      id: 3,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Leche',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '16.00',
      quantity: 1
    },
    {
      id: 4,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Pera',
      fam: 'Frutas',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '14.00',
      quantity: 1
    },
    {
      id: 5,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Piña',
      fam: 'Frutas',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '30.00',
      quantity: 1
    },
    {
      id: 6,
      imageUrl: '../../../../assets/img/frutas-ejemplo.jpg',
      title: 'Brócoli',
      fam: 'Verduras',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '20.00',
      quantity: 1
    }
  ]

  orderVisibility: boolean = false

  toggleOrderVisibility() {
  this.orderVisibility = !this.orderVisibility  
  }

}
