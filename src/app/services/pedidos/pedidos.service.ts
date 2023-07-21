import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { SERV_PEDIDOS } from 'src/config/config';
import { Pedido } from 'src/app/models/pedido.model';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    private pedidoFinalSubject = new BehaviorSubject<Pedido>(new Pedido(0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', 0, 0, 0, []))
    pedidoFinal$ = this.pedidoFinalSubject.asObservable()

    constructor(private http: HttpClient) { }

    updatePedidoFinal(pedido: Pedido): void {
        this.pedidoFinalSubject.next(pedido)
    }

    getPedidoFinal() {
        return this.pedidoFinalSubject.value
    }

    obtenerPedidos(): Observable<any> {
        const parametros = {
            id_pedido: 0,
            id_almacen: 1,
            id_usuario: 1,
            token: "012354SDSDS01"
        };
        return this.http.post<any>(SERV_PEDIDOS, parametros);
    }

    guardarPedido(pedido: Pedido) {
        let url = "https://serp-inventarios.serteza.com/public/api/pedidos/guardarPedido";
        console.log("hola");
        return this.http.post(url, pedido).pipe(
            map((resp: any) => {
                console.log("hola si");
                console.log(resp);
                Swal.fire('Pedido creado exitosamente', '', 'success')
                return resp.data
            }), catchError(err => {
                console.log("hola no");
                Swal.fire("Ha ocurrido un error", err.error.message, 'error');
                return throwError(err);
            })), console.log ("hola después",pedido,url)
    }
}
