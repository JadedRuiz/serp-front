import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Familia } from 'src/app/models/familias.model';
import { SERV_FAM } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FamiliasService {
  constructor(private http: HttpClient) { }

  obtenerFamilias(): Observable<any> {
    const parametros = {
      id_familia: 0,
      id_comprador: 1,
      familia: '',
      token: '012354SDSDS01',
    };
    return this.http.post<any>(SERV_FAM, parametros);
  }

  editarFam(id: number, familia: any) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/familias/guardarFamilia';

    return this.http.post(url, familia).pipe(
      map((resp: any) => {
        if (resp.ok) {
          Swal.fire('La familia fue editada con exito', '', 'success')
        } else {
          Swal.fire('Ha ocurrido un error', resp.error.message, 'error');
        }
        return resp;
      }),
      catchError((err) => {
        Swal.fire('Ha ocurrido un error', err.error.message, 'error');
        return throwError(err);
      })
    );
  }

  agregarFam(familia: Familia) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/familias/guardarFamilia';

    return this.http.post(url, familia).pipe(
      map((resp: any) => {
        if (resp.ok) {
          Swal.fire('Familia creada exitosamente', '', 'success');
        } else {
          Swal.fire('Ha ocurrido un error', '', 'error');
        }
        return resp.data;
      })
    );
  }

  deleteFamily(id: number) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/familias/guardarFamilia/' +
      id;
    return this.http
      .put(url, {})

      .pipe(
        map((resp: any) => {
          Swal.fire('Familia creada BORRADA', '', 'success');
          return resp.data;
        })
      );
  }

  desactivarFamilia(id_familia: number, activo: number) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/familias/activarFamilia?id_familia=' +
      id_familia;
    return this.http.post(url, '').pipe(
      map((resp: any) => {
        let mensaje = activo == 0 ? 'activada' : 'desactivada';
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `La familia fue ${mensaje}`,
          timer: 1500,
        });
        return resp.data;
      })
    );
  }



}
