import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SERVER_API } from 'src/config/config';
import { Perfil } from 'src/app/models/perfil.model';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  constructor(private http: HttpClient) {}

 

  //OBTENER PERFILES
  obtenerPerfil(json:any): Observable<any> {
    return this.http.post<any>(SERVER_API + "perfiles/consultarPerfiles",json)
  }
}
