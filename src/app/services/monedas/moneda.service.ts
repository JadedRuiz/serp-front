import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API } from 'src/config/config';
import { Moneda } from 'src/app/models/moneda.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {
  private http = inject(HttpClient)

  constructor() { }

  getMonedas(json:any){
    const url = SERVER_API +"sat/consultarMonedas";
    return this.http.post(url,json)
    .pipe(map( (res:any)=>{
      return res;
    }))
  }


}
