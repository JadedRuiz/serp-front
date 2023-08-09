import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SERVER_API } from 'src/config/config';
import { Pedido } from 'src/app/models/pedido.model';
import Swal from 'sweetalert2';
import { PedidoGuardar } from 'src/app/models/pedidoguardar.model';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    private pedidoFinalSubject = new BehaviorSubject<PedidoGuardar>(new PedidoGuardar(0, 1, 0, 0, 'TOKEN', '', '', 1, [], 0, 0));
    pedidoFinal$ = this.pedidoFinalSubject.asObservable()

    constructor(private http: HttpClient) { }

    //ACTUALIZAR EL OBJETO DEL PEDIDO QUE SE ENVÍA EN EL PROCESO DE REALIZAR UN PEDIDO
    updatePedidoFinal(pedido: PedidoGuardar): void {
        this.pedidoFinalSubject.next(pedido)
    }

    //OBTENER EL OBJETO DEL PEDIDO QUE SE ENVÍA EN EL PROCESO DE REALIZAR UN PEDIDO
    getPedidoFinal() {
        return this.pedidoFinalSubject.value
    }

    //OBTENER PEDIDOS POR PAGAR
    consultarPorPagar(json: any) {
        return this.http.post<any>(SERVER_API + 'pedidos/consultarPedidosPorPagar', json);
    }

    // PEDIDOS GENERALES
    obtenerPedidos(): Observable<any> {
        const parametros = {
            id_pedido: 0,
            id_almacen: 1,
            id_usuario: 1,
            token: "012354SDSDS01"
        };
        return this.http.post<any>(SERVER_API + 'pedidos/consultarPedidos', parametros);
    }

    //BUSCAR UN PEDIDO EN ESPECÍFICO
    buscarPedido(id_pedido: number) {
        let parametros = {
            id_pedido: id_pedido,
            token: "012354SDSDS01"
        }

        let url = SERVER_API + `pedidos/buscarPedido`
        return this.http.post<any>(url, parametros);
    }

    //GUARDAR UN PEDIDO
    guardarPedido(pedido: PedidoGuardar) {
        let url = SERVER_API + 'pedidos/guardarPedido';
        return this.http.post(url, pedido).pipe(
            map((resp: any) => {
                if (resp.ok) {
                    Swal.fire('Pedido creado exitosamente', '', 'success')
                    return resp.data
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error',
                        text: resp.message || 'Ha ocurrido un error'
                    });
                    return throwError(resp);
                }
            }), catchError(err => {
                Swal.fire("Ha ocurrido un error", err.error.message, 'error');
                return throwError(err);
            }))
    }
}
