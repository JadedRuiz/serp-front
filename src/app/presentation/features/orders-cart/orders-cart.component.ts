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
  selector: 'app-orders-cart',
  templateUrl: './orders-cart.component.html',
  styleUrls: ['./orders-cart.component.scss']
})

export class OrdersCartComponent {

  cs_btn = "fas fa-shopping-cart";

  constructor() {
    this.getSubtotal();
    this.getTotal();
    this.noItems();
  }

  //Estado para manejar la visibilidad del carrito de pedidos
  ordersVisibility: boolean = true;

  //Función para manejar la visibilidad del carrito de pedidos
  toggleOrdersVisibility() {
    if(this.ordersVisibility){
      this.ordersVisibility = false;
      this.cs_btn = "fas fa-times";
    }else{
      this.ordersVisibility = true;
      this.cs_btn = "fas fa-shopping-cart";
    }  
  }

  //Simulación de base de datos
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

  //Estados para manejar las cuentas del carrito
  totalPerItem: number = 0
  subtotal: number = 0
  total: number = 0
  discounts: number = 0 // Normalmente su valor vendrá de la base de datos
  price: number = 0

  //Estado para manejar si el carrito está vacío o no
  isCartEmpty = true

  //Función para manejar el estado del carrito
  noItems() {
    if (this.items.length !== 0) {
      this.isCartEmpty = this.isCartEmpty = false
    } else {
      this.isCartEmpty = this.isCartEmpty = true
    }
  }

  getTotalPerItem(item: any) {
    this.totalPerItem = item.price * item.quantity
  }

  //Función para obtener el subtotal del pedido
  getSubtotal() {
    this.subtotal = 0
    for (let item of this.items) {
      this.price = parseInt(item.price)
      this.subtotal += this.price * item.quantity
    }
    this.getTotal()
  }

  //Función para obtener el total del pedido
  getTotal() {
    this.total = 0
    this.total = this.subtotal - this.discounts
  }

  //Estado para manejar el CSS del botón decrease
  btnQuantityOff: boolean = true

  //Función para aumentar la cantidad de un ítem específico en el carrito
  increaseItemQuantity(item: item) {
    item.quantity++
    this.btnQuantityOff = false
    this.getSubtotal()
  }

  //Función para disminuir la cantidad de un ítem específico en el carrito
  decreaseItemQuantity(item: item) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1
      this.btnQuantityOff = false
    } else {
      this.btnQuantityOff = true
    }
    this.getSubtotal()
  }

  //Función para eliminar producto del carrito
  deleteProduct(item: item) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.getSubtotal()
  }

  modalVisibility = false

  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility
  }

}
