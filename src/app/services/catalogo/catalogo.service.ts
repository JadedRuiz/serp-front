import { EventEmitter, Injectable, Output } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { Product } from 'src/app/models/products.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  @Output() disparadorDeProductos: EventEmitter<any> = new EventEmitter();

  constructor(public http: HttpClient, private famService:FamiliaService) {}


  //=> Obetener familia.acivo
  buscarFamilias(): Observable<any> {
     return this.famService.obtenerFamilias().pipe(
      map((response) => {
        if (response.ok){
          //console.log('service=>',response.data);
          return response.data;
        }else {
          console.log('Ocurrió un error:', response.message);
          return null;
        }
      })
    );
  }

//Para obtener Artiuclos
obtenerArticulos(): Observable<any> {
    const parametros = {
      id_articulo: 0,
      id_comprador: 1,
      articulo: '',
      token: '012354SDSDS01',
    };
    return this.http.post<any>(SERVER_API, parametros);
  }


//Para guardar productos
  agregarProducto(producto: Product) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/articulos/guardarArticulo';

    return this.http.post(url, producto).pipe(
      map((resp: any) => {
        //console.log('service',resp);
        Swal.fire('Producto creado con exito', '', 'error');
        return resp.data;
      })
    );
  }

  //Para Guardar Fotografias
  guardarFotos(fotos :any): Observable<any>{
    let url ='https://serp-inventarios.serteza.com/public/api/articulos/guardarFotografia';
   const observables = fotos.map((foto:any)=>{
     const parametros = {
       id_articulo_fotografia: 0,
       id_articulo: 0,
       id_fotografia: 1,
       token: "012354SDSDS01",
       foto_base64: foto.base64,
       extencion: "JPG"
     }
     return this.http.post(url,parametros).pipe(
      map((resp:any)=>{
        console.log('Foto Guardada',resp);
        return resp.data
      })
     );
   });
   return forkJoin(observables);
  }



}
