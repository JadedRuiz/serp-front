import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERV_ALMACEN } from 'src/config/config';
import { Almacen } from 'src/app/models/almacen.model';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class AlmacenService {
  constructor(private http: HttpClient) {}

  obtenerAlmacenes(json:any): Observable<any> {
    return this.http.post<any>(SERV_ALMACEN, json);
  }
  editarAlmacen(id: number, almacen: any) {
    let url = 'https://serp-inventarios.serteza.com/public/api/almacenes/guardarAlmacen';
    return this.http.post( url, almacen )
    .pipe(map( (resp: any) => {
      return resp;
    }), catchError(err => {
      Swal.fire("Ha ocurrido un error", err.error.message, 'error');
      return throwError(err);
    }));
  }


    agregarAlmacen(almacen: Almacen) {
      let url = 'https://serp-inventarios.serteza.com/public/api/almacenes/guardarAlmacen';

      return this.http.post(url, almacen)
        .pipe(
          map((resp: any) => {
            console.log(resp);
            Swal.fire('Almacen creado exitosamente', '', 'success');
            return resp.data;
          }),
          catchError(err => {
            Swal.fire('Error al crear Almacen', err.error.message, 'error');
            return throwError(err);
          })
        );
    }
    activarAlmacen(id_almacen: number, activo: number) {
      let url = 'https://serp-inventarios.serteza.com/public/api/almacenes/activarAlmacen?id_almacen=' + id_almacen;
      return this.http.post(url, '').pipe(
        map((resp: any) => {
          let mensaje = activo == 0 ? 'Activado' : 'Desactivado';
          Swal.fire({
            position: 'center',
            icon:'success',
            title: `El almacen fue ${mensaje}`,
          });
          console.log(resp);
          return resp.data;
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
