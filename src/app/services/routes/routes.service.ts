import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Route } from 'src/app/models/routes.model';
import { SERV_ROUTES } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  constructor(private http: HttpClient) { }

  obtenerRutas(): Observable<any> {
    const parametros = {
      id_ruta: 0,
      id_comprador: 1,
      token: "012354SDSDS01",
      ruta: ""
    };

    return this.http.post<any>(SERV_ROUTES, parametros);
  }


  editarRuta(id:number, route: any) {

    let url = 'https://serp-inventarios.serteza.com/public/api/rutas/guardarRuta';


    return this.http.post(url, route)
      .pipe(map((resp: any) => {
        return resp;
        
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  agregarRuta(route: Route) {
    let url = "https://serp-inventarios.serteza.com/public/api/rutas/guardarRuta"

    return this.http.post(url, route)
      .pipe(map((resp: any) => {
        // console.log(resp);
        Swal.fire('Ruta creada exitosamente', '', 'success')
        return resp.data
      }))
  }
  eliminarRuta(id: number) {
    let url = "https://serp-inventarios.serteza.com/public/api/rutas/guardarRuta/" + id;

    return this.http.put(url, {})
      .pipe(map((resp: any) => {
        console.log(resp);
        Swal.fire('Ruta creada exitosamente', '', 'success')
        return resp.data
      }))
  }
}
