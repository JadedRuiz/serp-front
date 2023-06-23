import { EventEmitter, Injectable, Output } from '@angular/core';
import { SERVER_API, SERV_FAM, } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  @Output()disparadorDeProductos:EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient,
  ) { }


  obtenerPerfiles() {
    let url = SERVER_API + "obtenerPerfiles";
    return this.http.get(url)
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }



}
