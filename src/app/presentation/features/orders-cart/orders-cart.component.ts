import { Component, EventEmitter, Output } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';

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

  constructor(
    private catalgoo: CatalogoService,
  ) {
  }

  ngOnInit():void {
    this.getSubtotal();
    this.getTotal();
    this.noItems();
    this.getPedido()
  }

  //Estado para manejar la visibilidad del carrito de pedidos
  ordersVisibility: boolean = false;

  //Función para manejar la visibilidad del carrito de pedidos
  toggleOrdersVisibility() {
    if (this.ordersVisibility) {
      this.ordersVisibility = false;
    } else {
      this.ordersVisibility = true;
    }
    this.getPedido()
  }
  
  //Estados para manejar las cuentas del carrito
  totalPerItem: number = 0
  subtotal: number = 0
  total: number = 0
  discounts: number = 0 // Normalmente su valor vendrá de la base de datos
  price: number = 0
  pedido:Articulo[] =  this.getPedido()
  
  getPedido():Articulo[] {
    return this.pedido = JSON.parse(sessionStorage.getItem('carrito')!) || [];
  }

  //Estado para manejar si el carrito está vacío o no
  isCartEmpty = true

  //Función para manejar el estado del carrito
  noItems() {
    if (this.pedido.length !== 0) {
      this.isCartEmpty = this.isCartEmpty = false
    } else {
      this.isCartEmpty = this.isCartEmpty = true
    }
  }

  //Función para obtener el total de cada item multiplicándose por su cantidad
  getTotalPerItem(item: any) {
    this.totalPerItem = item.price * item.quantity
  }

  //Función para obtener el subtotal del pedido
  getSubtotal() {
    this.subtotal = 0
    for (let item of this.pedido) {
      this.price = item.precio_venta
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
  increaseItemQuantity(item: Articulo) {
    item.quantity++
    this.btnQuantityOff = false
    this.getSubtotal()
  }

  //Función para disminuir la cantidad de un ítem específico en el carrito
  decreaseItemQuantity(item: Articulo) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1
      this.btnQuantityOff = false
    } else {
      this.btnQuantityOff = true
    }
    this.getSubtotal()
  }

  //Función para eliminar producto del carrito
  deleteProduct(item: Articulo) {
    const index = this.pedido.findIndex((i) => i.id_articulo === item.id_articulo);
    if (index !== -1) {
      this.pedido.splice(index, 1);
      sessionStorage.setItem('carrito', JSON.stringify(this.pedido))
      this.getPedido()
    }
    this.getSubtotal()
  }

  @Output() toggleModalVisibility = new EventEmitter()
  // @Output()  getPedido = new EventEmitter()

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
  }
}
