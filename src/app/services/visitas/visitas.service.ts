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

  consultarVisitas(json:any):Observable<any>{
    return this.http.post<any>(SERV_VISITAS +'visitas/consultarVisitas',json)
  }

}
