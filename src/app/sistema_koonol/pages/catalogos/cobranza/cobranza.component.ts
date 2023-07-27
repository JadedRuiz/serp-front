import { Component } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';


@Component({
  selector: 'app-cobranza',
  templateUrl: './cobranza.component.html',
  styleUrls: ['./cobranza.component.scss']
})
export class CobranzaComponent {
  pedidos: any = []


  constructor(
    private pedidosRealizados:PedidosService,
  ){}



  ngOnInit() {
    this.obtenerPedidos()
  }

 
  obtenerPedidos() {
    this.pedidosRealizados.obtenerPedidos().subscribe(
      (response) => {
        this.pedidos = response.data
      }
    )
  }

}
