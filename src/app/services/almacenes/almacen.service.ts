import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERV_ALMACEN } from 'src/config/config';
import { Almacen } from 'src/app/models/almacen.model';

@Injectable({
  providedIn: 'root',
})
export class AlmacenService {
  constructor(private http: HttpClient) {}

  obtenerAlmacenes(json:any): Observable<any> {
    return this.http.post<any>(SERV_ALMACEN, json);
  }

  


}
