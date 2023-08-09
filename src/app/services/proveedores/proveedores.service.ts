import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { SERVER_API } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) { }


  //OBTENER LOS PROVEEDORES
  obtenerProveedores(json: any): Observable<any> {
    return this.http.post<any>(SERVER_API + 'proveedores/consultarProveedores', json);
  }

  //EDITAR UN PROVEEDOR
  editarProveedor(id: number, proveedor: any) {
    let url = SERVER_API + 'proveedores/guardarProveedor';
    return this.http.post(url, proveedor)
      .pipe(map((resp: any) => {
        if (resp.ok) {
          Swal.fire('Proveedor editado con exito', '', 'success');
          return resp;

        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: resp.message || 'Ha ocurrido un error',
          });
        }
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  //AGREGAR UN PROVEEDOR
  agregarProveedor(proveedor: Proveedor) {
    let url = SERVER_API + 'proveedores/guardarProveedor';
    console.log(proveedor);

    return this.http.post(url, proveedor)
      .pipe(
        map((resp: any) => {
          if (resp.ok) {
            Swal.fire('Proveedor creado con exito', '', 'success');
            return resp.data;
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error',
              text: resp.message || 'Ha ocurrido un error',
            });
            console.error(resp);
            return throwError(resp);
          }
        }),
        catchError(err => {
          Swal.fire('Error al crear proveedor', err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  //ACTIVAR UN PROVEEDOR
  activarProveedor(id_proveedor: number, activo: number) {
    let url = SERVER_API + 'proveedores/activarProveedor?id_proveedor=' + id_proveedor;
    return this.http.post(url, '').pipe(
      map((resp: any) => {
        if (resp.ok) {
          let mensaje = activo == 0 ? 'Activado' : 'Desactivado';
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: mensaje,
          });
          return resp.data;
        }
      }),
      catchError((error: any) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error',
        });
        console.error(error);
        return throwError(error);
      })
    );
  }

}
