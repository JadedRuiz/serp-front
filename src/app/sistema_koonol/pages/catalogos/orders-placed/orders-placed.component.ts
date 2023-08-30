import { Component, ElementRef, ViewChild } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { ArticuloFinal } from 'src/app/models/articulofinal.model';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
   selector: 'app-orders-placed',
   templateUrl: './orders-placed.component.html',
   styleUrls: ['./orders-placed.component.scss']
})

export class OrdersPlacedComponent {
   modalVisibility: boolean = false
   orderVisibility: boolean = false
   editOrderVisibility: boolean = false
   pedidos: any[] = []
   articulosPedido: ArticuloFinal[] = []
   pedidoSeleccionado: any;

   constructor(
      private pedidosRealizados: PedidosService,
   ) { }

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

   seleccionarPedido(id_pedido: number) {
      this.pedidoSeleccionado = this.pedidos.find(pedidos => pedidos.id_pedido == id_pedido)
      console.log(this.pedidoSeleccionado);
      this.buscarPedido(id_pedido)
      this.toggleModalVisibility()
   }

   buscarPedido(id_pedido: number) {
      this.pedidosRealizados.buscarPedido(id_pedido).subscribe(
         (response) => {
            this.articulosPedido = response.data
         })
   }

   toggleModalVisibility() {
      this.modalVisibility = !this.modalVisibility
      this.orderVisibility = !this.orderVisibility
   }

   closeModal() {
      this.modalVisibility = false
      this.orderVisibility = false
      this.editOrderVisibility = false
   }

   openEditOrderVisibility() {
      this.editOrderVisibility = true
      this.orderVisibility = false
   }

   saveEditedOrder() {
      this.editOrderVisibility = false
      this.orderVisibility = true
   }

   //GENERAR PDF DE COTIZACIÓN
   @ViewChild('cotizacion', { static: false }) cotizacion!: ElementRef

   generarPdfCotizacion() {
      html2pdf()
      .set({
         margin: 1,
         filename: `Cotización para ${this.pedidoSeleccionado.cliente}.pdf`,
         html2canvas: {
            scale: 4,
            letterRendering: true
         },
         jsPDF: {
            unit: 'in',
            format: 'a3',
            orientation: 'portrait'
         }
      })
      .from(this.cotizacion.nativeElement).save()
   }

} 
