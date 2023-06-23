import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SERV_FAM } from 'src/config/config';
import Swal from 'sweetalert2';
import {map,catchError} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class FamiliaService {
  constructor(private http: HttpClient) { }

  obtenerFamilias(): Observable<any> {
    const parametros = {
      id_familia: 0,
      id_comprador: 1,
      familia: '',
      token: '012354SDSDS01'
    };
    return this.http.post<any>(SERV_FAM, parametros);
  }

  editarFam(familia: any) {

      let url = 'https://serp-inventarios.serteza.com/public/api/familias/guardarFamilia';


      return this.http.post( url, familia )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

agregarFam(){



}
}
