import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERVER_API } from 'src/config/config';
import { Medida } from 'src/app/models/medidas.model';

@Injectable({
  providedIn: 'root'
})
export class MedidaService {

  constructor(private http: HttpClient) { }

obtenerMedidas(): Observable<any>{
  const parametros = {
    id_medida: 0,
    id_comprador: 1,
    medida:'',
    solo_activos: 1,
    token: '012354SDSDS01'
  };
  return this.http.post<any>(SERVER_API + 'medidas/consultarMedidas', parametros);
}


}
