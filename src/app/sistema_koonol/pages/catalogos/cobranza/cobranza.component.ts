import { Component } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';


@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss']
})
export class CobranzaComponent {
  pedidos: any = []
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
  totalIngresos: number = 0;
  totalCambio: number = 0;

  constructor(
    private pedidosRealizados:PedidosService,
  ){}



  ngOnInit() {
    this.obtenerPedidos()
  }

  //Para obtener Pedidos
  obtenerPedidos() {
    this.pedidosRealizados.obtenerPedidos().subscribe(
      (response) => {
        this.pedidos = response.data
      }
    )
  }

//Para la calculadora
calcular(){
this.totalIngresos=
this.b1000*1000+
this.b500*500+
this.b200*200+
this.b100*100+
this.b50*50+
this.b20*20+
this.m10*10+
this.m5*5+
this.m2*2+
this.m1*1;
 // Asegurarse de que haya un valor válido en el campo "Ingreso" para cada billete/moneda
 if (!isNaN(this.totalIngresos)) {
  this.totalCambio = 0;// Reemplaza TOTAL_PEDIDO con el total del pedido actual
}
}


}
