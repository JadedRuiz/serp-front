import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERV_VISITAS } from 'src/config/config';
import { VisitasDTO } from 'src/app/models/visitas.model';
import Swal from 'sweetalert2';
import { Observable, catchError, map, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class VisitasService {

  constructor(private http: HttpClient) { }


  //=> Constultar visitas
  consultarVisitas(json:any):Observable<any>{
    return this.http.post<any>(SERV_VISITAS +'visitas/consultarVisitas',json)
  }

//=> Guardar Visitas
agregarVisitas(visita: VisitasDTO){
  return this.http.post<any>(SERV_VISITAS +'visitas/guardarVisita',visita).pipe(
    map((resp: any) => {
      if (resp.ok) {
        Swal.fire('Exito', '', 'success');
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
    }),
    catchError(err => {
      Swal.fire('Error al crear la visita', err.error.message, 'error');
      return throwError(err);
    })
  );
}


}
