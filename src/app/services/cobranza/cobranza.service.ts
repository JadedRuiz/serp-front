import { Injectable } from '@angular/core';
import { SERV_COBRANZA } from 'src/config/config';
import { CobranzaDto } from 'src/app/models/cobranza.model';
import {HttpClient} from '@angular/common/http'
import Swal from 'sweetalert2';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobranzaService {

  constructor(

    private http :HttpClient

  ) { }


// CONSULTAR COBRANZAS
consultarCobranza(json:any){
return this.http.post<any>(SERV_COBRANZA + 'cobranza/consultarCobranza',json);
}



//Guarcar Cobranza
  guardarCobranza(cobranza:CobranzaDto) {
    return this.http.post<any>(SERV_COBRANZA + 'cobranza/guardarCobranza',cobranza).pipe(
      map((resp:any)=>{
        if(resp.ok){
          Swal.fire('El cobro se guardo con exito', '', 'success');
          return resp.data;
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: resp.message || 'Ha ocurrido un error'
          });
          return throwError(resp);
        }
      })
    )

  }



}
