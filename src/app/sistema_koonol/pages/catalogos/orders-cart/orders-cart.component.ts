import { Component, EventEmitter, Output } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';

@Component({
  selector: 'app-orders-cart',
  templateUrl: './orders-cart.component.html',
  styleUrls: ['./orders-cart.component.scss']
})

export class OrdersCartComponent {

  pedido: Articulo[] = []
  
  constructor(private catalogo: CatalogoService) { }

  ngOnInit(): void {
    this.catalogo.pedido$.subscribe(pedido => {
      this.pedido = pedido
      this.getTotal();
      this.getSubtotal();
      this.noItems();
    })
  }

  //Estado para manejar la visibilidad del carrito de pedidos
  ordersVisibility: boolean = false;
  cerrarCarrito: boolean = true

  //Función para manejar la visibilidad del carrito de pedidos
  toggleOrdersVisibility() {
    if (this.ordersVisibility) {
      this.cerrarCarrito = true
      setTimeout(() => {
        this.ordersVisibility = false;
      }, 400)
    } else {
      this.cerrarCarrito = false
      this.ordersVisibility = true;
    }
  }

  //Estados para manejar las cuentas del carrito
  totalPerItem: number = 0
  subtotal: number = 0
  total: number = 0
  discounts: number = 0 // Normalmente su valor vendrá de la base de datos
  price: number = 0
  quantity: number = 0


  //Estado para manejar si el carrito está vacío o no
  isCartEmpty = true

  //Función para manejar el estado del carrito
  noItems() {
    // this.pedido = this.catalogo.getPedido()
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
    this.catalogo.updatePedido(this.pedido)
  }

  //Función para disminuir la cantidad de un ítem específico en el carrito
  decreaseItemQuantity(item: Articulo) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1
      this.btnQuantityOff = false
    } else {
      this.btnQuantityOff = true
    }
    this.catalogo.updatePedido(this.pedido)
    this.getSubtotal()
  }

  //Función para eliminar producto del carrito
  deleteProduct(item: Articulo) {
    const index = this.pedido.findIndex((articulo) => articulo.id_articulo === item.id_articulo);
    if (index !== -1) {
      this.pedido.splice(index, 1);
      sessionStorage.setItem('pedido', JSON.stringify(this.pedido))
    }
    this.catalogo.updatePedido(this.pedido)
    // this.catalogo.getPedido()
    this.getSubtotal()
    // this.noItems()
  }

  @Output() toggleModalVisibility = new EventEmitter()
  // @Output()  getPedido = new EventEmitter()

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit()
    this.toggleOrdersVisibility()
  }
}
