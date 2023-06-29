import { EventEmitter, Injectable, Output } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { Product } from 'src/app/models/products.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  @Output() disparadorDeProductos: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient) {}

  obtenerPerfiles(): Observable<any> {
    const parametros = {
      id_articulo: 0,
      id_comprador: 1,
      articulo: '',
      token: '012354SDSDS01',
    };
    return this.http.post<any>(SERVER_API, parametros);
  }

  agregarProducto(producto: Product) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/clientes/guardarArticulo';

    return this.http.post(url, producto).pipe(
      map((resp: any) => {
        console.log(resp);
        Swal.fire('Producto creado con exito', '', 'success');
        return resp.data;
      })
    );
  }

  // obtenerPerfiles() {
  //   let url = SERVER_API + "obtenerPerfiles";
  //   return this.http.get(url)
  //     .pipe(map((resp: any) => {
  //       return resp;
  //     }),
  //     catchError(err => {
  //       Swal.fire("Ha ocurrido un error", err.error.message, 'error');
  //       return throwError(err);
  //     }));
  //}
}
