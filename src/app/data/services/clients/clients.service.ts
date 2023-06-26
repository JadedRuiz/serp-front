import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERV_CLIENTS } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<any> {
    const parametros = {
        id_cliente_direccion: 0,
        id_comprador: 1,
        cliente: "",
        token: "012354SDSDS01",
    };

    return this.http.post<any>(SERV_CLIENTS, parametros);
  }

}
