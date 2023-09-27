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



obtenerMedidas(json:any): Observable<any>{
  return this.http.post<any>(SERVER_API + 'medidas/consultarMedidas', json);
}


guardarMedidas(json:any){
 return this.http.post<any>(SERVER_API + 'medidas/guardarMedida', json);
}

medidasSAT(json:any){
  return this.http.post<any>(SERVER_API + 'medidas/consultarMedidasSat', json);
}


}
