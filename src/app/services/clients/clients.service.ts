import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { Foto } from 'src/app/models/fotografias.model';
import { SERVER_API } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }

  obtenerClientes(json: any): Observable<any> {
    return this.http.post<any>(SERVER_API+'clientes/buscarClientes', json);
  }

  obtenerDirecciones(id_cliente: number, id_cliente_direccion?: number): Observable<any> {
    const parametros = {
      id_cliente: id_cliente,
      id_cliente_direccion: id_cliente_direccion || 0,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    }
    return this.http.post<any>(SERVER_API+'clientes/buscarDireccionesCliente', parametros)
  }

  editarCliente(id: number, cliente: Client) {

    let url = SERVER_API+'clientes/guardarCliente';

    return this.http.post(url, cliente)
      .pipe(map((resp: any) => {
        Swal.fire('Cliente editado exitosamente', '', 'success')
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  agregarCliente(cliente: Client) {
    let url = SERVER_API+"clientes/guardarCliente"

    return this.http.post(url, cliente)
      .pipe(map((resp: any) => {
        if (resp.ok) {
          Swal.fire('Cliente creado exitosamente', '', 'success')
          return resp.data
        } else {
          Swal.fire('Error al crear el cliente', resp.message, 'error');
        }
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  editarDireccion(id_direccion: number, direccion: Address) {
    let url = SERVER_API+'clientes/guardarDireccionCliente';


    return this.http.post(url, direccion)
      .pipe(map((resp: any) => {
        Swal.fire('Dirección editada exitosamente', '', 'success')
        return resp.data;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  agregarDireccion(direccion: Address) {
    let url = SERVER_API+"clientes/guardarDireccionCliente"

    return this.http.post(url, direccion)
      .pipe(map((resp: any) => {
        Swal.fire('Dirección creada exitosamente', '', 'success')
        return resp.data
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  guardarFotosDireccion(id_cliente_direccion: number, fotos: any[]) {
    let url = SERVER_API+"clientes/guardarFotografia"

    const observables = fotos.map((foto: string) => {
      let foto_base64 = foto.slice(22);
      const parametros = {
        id_cliente_fotografia: 0,
        id_comprador: 1,
        id_cliente_direccion: id_cliente_direccion,
        id_fotografia: 0,
        token: "012354SDSDS01",
        foto_base64: foto_base64,
        extencion: "JPG"
      }
      return this.http.post(url, parametros).pipe(
        map((resp: any) => {
          return resp
        })
      );
    });
    return forkJoin(observables);
  }

  guardarUbicacionDireccion(id_cliente_direccion: number, long: number, lat: number) {
    let url = SERVER_API+"clientes/guardarLocalizacion";

    const params = {
      id_cliente_direccion: id_cliente_direccion,
      longitud: long,
      latitud: lat,
      token: ''
    };
    

    return this.http.post(url, params).pipe(
      map((resp: any) => {
        return resp
      })
    );
  };

}