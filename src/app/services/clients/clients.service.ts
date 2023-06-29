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

  editarDireccion(id: number, direccion: Address) {
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

  // crearCliente(cliente: any) {
  //   this.http.post('/api/clientes', cliente).subscribe((response: any) => {
  //     const clienteId = response.id; // Capturar el ID del cliente creado
  
  //     const direccion = {
  //       clienteId: clienteId,
  //       // Otros datos de la dirección
  //     };
  
  //     this.http.post('/api/direcciones', direccion).subscribe(() => {
  //       // La dirección se ha creado y vinculado al cliente correctamente
  //       // Realizar cualquier otra acción necesaria
  //     }, (error) => {
  //       // Manejar el error en caso de que la creación de la dirección falle
  //     });
  //   }, (error) => {
  //     // Manejar el error en caso de que la creación del cliente falle
  //   });
  // }
  
  // crearClienteConDirecciones(cliente: any, direcciones: any[]) {
  //   this.http.post('/api/clientes', cliente).subscribe((response: any) => {
  //     const clienteId = response.id; // Capturar el ID del cliente creado
  
  //     direcciones.forEach(direccion => {
  //       direccion.clienteId = clienteId; // Asignar el ID del cliente a cada dirección
  
  //       this.http.post('/api/direcciones', direccion).subscribe(() => {
  //         // La dirección se ha creado y vinculado al cliente correctamente
  //         // Realizar cualquier otra acción necesaria
  //       }, (error) => {
  //         // Manejar el error en caso de que la creación de la dirección falle
  //       });
  //     });
  //   }, (error) => {
  //     // Manejar el error en caso de que la creación del cliente falle
  //   });
  // }


}
