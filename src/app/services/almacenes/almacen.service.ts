import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERV_ALMACEN } from 'src/config/config';
import { Almacen } from 'src/app/models/alamacen.model';

@Injectable({
  providedIn: 'root',
})
export class AlmacenService {
  constructor(private http: HttpClient) {}

  obtenerAlamacenes(): Observable<any> {
    const parametros = {
      id_almacen: 0,
      id_comprador: 1,
      almacen: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    return this.http.post<any>(SERV_ALMACEN, parametros );
  }
}
