import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  SERV_FAM } from 'src/config/config';




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


}
