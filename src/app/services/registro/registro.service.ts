import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LIGA_API } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(
    public http: HttpClient
  ) { }

  catalogoCategorias(){
    let url = LIGA_API+"categorias";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }));
  }
  login(json : any){

    let url = LIGA_API+"registro/login";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {

        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  enviar(json : any){
    let url = LIGA_API+"registro/solicitud";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  recuperarContra(json : any){
    let url = LIGA_API+"registro/recuperarContra";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }
  enviarContra(id_usuario : any){
    let url = LIGA_API+"registro/enviarContra/"+id_usuario;
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

}
