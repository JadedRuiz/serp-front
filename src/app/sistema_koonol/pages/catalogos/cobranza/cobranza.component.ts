import { Component } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss'],
})
export class CobranzaComponent {
  pedidos: any = [];
  pedidoSeleccionado: any;

  b1000: number = 0;
  b500: number = 0;
  b200: number = 0;
  b100: number = 0;
  b50: number = 0;
  b20: number = 0;
  m10: number = 0;
  m5: number = 0;
  m2: number = 0;
  m1: number = 0;
  b1000Cambio: number = 0;
  b500Cambio: number = 0;
  b200Cambio: number = 0;
  b100Cambio: number = 0;
  b50Cambio: number = 0;
  b20Cambio: number = 0;
  m10Cambio: number = 0;
  m5Cambio: number = 0;
  m2Cambio: number = 0;
  m1Cambio: number = 0;
  totalIngresos: number = 0;
  totalCambio: number = 0;
  totalIngresosReal: number = 0;

  constructor(private pedidosRealizados: PedidosService) {}

  ngOnInit() {
    this.obtenerPedidos();
  }

  //Para obtener Pedidos
  obtenerPedidos() {
    this.pedidosRealizados.obtenerPedidos().subscribe((response) => {
      this.pedidos = response.data;
    });
  }

 // Función para abrir el modal y establecer el pedido seleccionado
 abrirModalPago(pedido: any) {
  this.pedidoSeleccionado = pedido;
  console.log('pedido :>> ', pedido);
}

  //Para la calculadora
  calcular() {
    this.totalIngresos =
      this.b1000 * 1000 +
      this.b500 * 500 +
      this.b200 * 200 +
      this.b100 * 100 +
      this.b50 * 50 +
      this.b20 * 20 +
      this.m10 * 10 +
      this.m5 * 5 +
      this.m2 * 2 +
      this.m1 * 1;

    this.totalCambio =
      this.b1000Cambio * 1000 +
      this.b500Cambio * 500 +
      this.b200Cambio * 200 +
      this.b100Cambio * 100 +
      this.b50Cambio * 50 +
      this.b20Cambio * 20 +
      this.m10Cambio * 10 +
      this.m5Cambio * 5 +
      this.m2Cambio * 2 +
      this.m1Cambio * 1;

    this.totalIngresosReal = this.totalIngresos - this.totalCambio;
  }
}
