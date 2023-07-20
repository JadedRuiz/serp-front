import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERV_PEDIDOS } from 'src/config/config';

@Injectable({
    providedIn: 'root'
})
export class PedidosService {

    constructor(private http: HttpClient) { }

    obtenerPedidos(): Observable<any> {
        const parametros = {
            id_pedido: 0,
            id_almacen: 1,
            id_usuario: 1,
            token: "012354SDSDS01"
        };
        return this.http.post<any>(SERV_PEDIDOS, parametros);
  }
  
}
