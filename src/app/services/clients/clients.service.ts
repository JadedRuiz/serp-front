import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { SERV_ADDRESSES, SERV_CLIENTS } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }

  obtenerClientes(json:any): Observable<any> {
    return this.http.post<any>(SERV_CLIENTS, json);
  }

  obtenerDirecciones(id_cliente:number): Observable<any> {
    const parametros = {
      id_cliente: id_cliente,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    }
    console.log(parametros.id_cliente)
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

  editarDireccion(id_direccion: number, direccion: Address) {
    let url = 'https://serp-inventarios.serteza.com/public/api/clientes/guardarDireccionCliente';


    return this.http.post( url, direccion )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }

  agregarDireccion(direccion:Address){
    let url = "https://serp-inventarios.serteza.com/public/api/clientes/guardarDireccionCliente"

    return this.http.post(url, direccion)
    .pipe(map((resp: any) => {
      console.log(resp);
      Swal.fire('Cliente creado exitosamente', '', 'success')
      return resp.data
    }))
  }

}
