import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Client } from 'src/app/models/clients.model';
import { SERV_ADDRESSES, SERV_CLIENTS } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }

  obtenerClientes(): Observable<any> {
    const parametros = {
      id_cliente: 0,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    };
    return this.http.post<any>(SERV_CLIENTS, parametros);
  }

  obtenerDirecciones(id_cliente_direccion:number): Observable<any> {
    const parametros = {
      id_cliente_direccion: id_cliente_direccion,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    }
    return this.http.post<any>(SERV_ADDRESSES, parametros)
  }

  editarCliente(id: number, cliente: Client) {

      let url = 'https://serp-inventarios.serteza.com/public/api/clientes/guardarCliente';


      return this.http.post( url, cliente )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  agregarCliente(cliente:Client){
    let url = "https://serp-inventarios.serteza.com/public/api/clientes/guardarCliente"

    return this.http.post(url, cliente)
    .pipe(map((resp: any) => {
      console.log(resp);
      Swal.fire('Cliente creado exitosamente', '', 'success')
      return resp.data
    }))
  }
  agregarDireccion(cliente:Client){
    let url = "https://serp-inventarios.serteza.com/public/api/clientes/guardarCliente"

    return this.http.post(url, cliente)
    .pipe(map((resp: any) => {
      console.log(resp);
      Swal.fire('Cliente creado exitosamente', '', 'success')
      return resp.data
    }))
  }


}
