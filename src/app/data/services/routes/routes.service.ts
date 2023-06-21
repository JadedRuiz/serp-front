import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERV_ROUTES } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private http: HttpClient) { }

  obtenerRutas(): Observable<any> {
    const parametros = {
        id_ruta: 0,
        id_comprador: 1,
        token: "012354SDSDS01",
        ruta: ""
    };

    return this.http.post<any>(SERV_ROUTES, parametros);
  }

}
