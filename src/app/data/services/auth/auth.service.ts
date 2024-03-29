import { Injectable } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'; 
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }

  login(json : any){
    let url = SERVER_API+"usuario/login";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }


  
}
