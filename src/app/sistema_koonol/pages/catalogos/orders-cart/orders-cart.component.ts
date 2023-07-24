import { Component, EventEmitter, Output } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { ArticuloPedido } from 'src/app/models/articulopedido.model';
import { Pedido } from 'src/app/models/pedido.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-cart',
  templateUrl: './orders-cart.component.html',
  styleUrls: ['./orders-cart.component.scss'],
})
export class OrdersCartComponent {
  pedido: Articulo[] = [];
  pedidoFinal: Pedido = new Pedido(
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    '012354SDSDS01',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    []
  );
  formatter: any;

  constructor(
    private catalogo: CatalogoService,
    private pedidos: PedidosService
  ) {}

  ngOnInit(): void {
    this.formatter = new Intl.NumberFormat('en-NZ', {
      currency: 'NZD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.catalogo.pedido$.subscribe((pedido) => {
      this.pedido = pedido;
      this.getTotal();
      this.getSubtotal();
      this.noItems();
      this.pedidoFinal.articulos = [];
      this.pedido.forEach((articulo) => {
        this.pedidoFinal.articulos.push(
          new ArticuloPedido(
            0,
            articulo.id_existencia,
            articulo.precio_venta,
            articulo.costo_promedio,
            articulo.quantity,
            articulo.tasa_iva,
            articulo.precio_total_carrito
          )
        );
      });
      this.pedidos.updatePedidoFinal(this.pedidoFinal);
    });
    this.pedidos.pedidoFinal$.subscribe((pedidoFinal) => {
      this.pedidoFinal = pedidoFinal;
    });
  }

  //Estado para manejar la visibilidad del carrito de pedidos
  ordersVisibility: boolean = false;
  cerrarCarrito: boolean = true;

  //Función para manejar la visibilidad del carrito de pedidos
  toggleOrdersVisibility() {
    if (this.ordersVisibility) {
      this.cerrarCarrito = true;
      setTimeout(() => {
        this.ordersVisibility = false;
      }, 400);
    } else {
      this.cerrarCarrito = false;
      this.ordersVisibility = true;
    }
  }

  //Estados para manejar las cuentas del carrito
  totalPerItem: number = 0;
  subtotal: number = 0;
  total: number = 0;
  discounts: number = 0; // Normalmente su valor vendrá de la base de datos
  price: number = 0;
  quantity: number = 0;

  //Estado para manejar si el carrito está vacío o no
  isCartEmpty = true;

  //Función para manejar el estado del carrito
  noItems() {
    // this.pedido = this.catalogo.getPedido()
    if (this.pedido.length !== 0) {
      this.isCartEmpty = this.isCartEmpty = false;
    } else {
      this.isCartEmpty = this.isCartEmpty = true;
    }
  }

  //Función para obtener el subtotal del pedido
  getSubtotal() {
    this.subtotal = 0;
    for (let item of this.pedido) {
      this.price = item.precio_total;
      this.subtotal += this.price * item.quantity;
      item.precio_total_formateado = this.formatter.format(this.price);
    }
    this.getTotal();
  }

  //Función para obtener el total del pedido
  getTotal() {
    this.getTotalPerItem();
    this.total = 0;
    this.total = this.subtotal - this.discounts;
    this.pedidoFinal.precio_total = this.total;
    this.pedidos.updatePedidoFinal(this.pedidoFinal);
    this.total = this.formatter.format(this.total);
  }

  getTotalPerItem() {
    this.pedido.forEach((articulo) => {
      let articuloIVA = (articulo.precio_venta / 100) * articulo.tasa_iva;
      articulo.precio_total_carrito =
        (Number(articulo.precio_venta) + articuloIVA) * articulo.quantity;
    });
  }

  //Estado para manejar el CSS del botón decrease
  btnQuantityOff: boolean = true;

  //Función para aumentar la cantidad de un ítem específico en el carrito
  increaseItemQuantity(item: Articulo) {
    item.quantity++;
    this.btnQuantityOff = false;
    this.getSubtotal();
    this.catalogo.updatePedido(this.pedido);
  }

  //Función para disminuir la cantidad de un ítem específico en el carrito
  decreaseItemQuantity(item: Articulo) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
      this.btnQuantityOff = false;
    } else {
      this.btnQuantityOff = true;
    }
    this.catalogo.updatePedido(this.pedido);
    this.getSubtotal();
  }

  //Función para eliminar producto del carrito
  deleteProduct(item: Articulo) {
    const index = this.pedido.findIndex(
      (articulo) => articulo.id_existencia === item.id_existencia
    );
    if (index !== -1) {
      this.pedido.splice(index, 1);
      sessionStorage.setItem('pedido', JSON.stringify(this.pedido));
    }
    this.catalogo.updatePedido(this.pedido);
    // this.catalogo.getPedido()
    this.getSubtotal();
    // this.noItems()
  }

  clearCart() {
    Swal.fire({
      title: '¿Deseas vaciar el carrito?',
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedido = [];
        this.catalogo.updatePedido(this.pedido);
      }
    });
  }

  @Output() toggleModalVisibility = new EventEmitter();
  // @Output()  getPedido = new EventEmitter()

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit();
    this.toggleOrdersVisibility();
  }
}
