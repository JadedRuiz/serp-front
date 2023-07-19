import { EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { SERVER_API } from 'src/config/config';
import { Product } from 'src/app/models/products.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { forkJoin } from 'rxjs';
import { Articulo } from 'src/app/models/articulo.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  @ViewChild('productForm', {static:false})productForm!: any;

  private pedidoSubject = new BehaviorSubject<Articulo[]>([])
  pedido$ = this.pedidoSubject.asObservable()

  constructor(public http: HttpClient, private famService:FamiliaService) {
    this.updatePedidoFromSessionStorage
  }

  private updatePedidoFromSessionStorage(): void {
    const pedido = JSON.parse(sessionStorage.getItem('pedido')!) || []
    this.pedidoSubject.next(pedido);
  }

  getPedido():Articulo[] {
    this.updatePedidoFromSessionStorage()
    return this.pedidoSubject.value;
  }

  updatePedido(pedido: Articulo[]): void {
    sessionStorage.setItem('pedido', JSON.stringify(pedido));
    this.pedidoSubject.next(pedido)
  }

  //=> Obetener familia.acivo
  buscarFamilias(): Observable<any> {
     return this.famService.obtenerFamilias().pipe(
      map((response) => {
        if (response.ok){
          //console.log('service=>',response.data);
          return response.data;
        }else {
          catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
          })
          return null;
        }
      })
    );
  }

//Para obtener Artiuclos
obtenerArticulos(): Observable<any> {
    const parametros = {
      id_existencia: 0,
      id_comprador: 1,
      articulo: '',
      token: '012354SDSDS01',
      id_almacen: 1,
    };

    return this.http.post<any>(SERVER_API, parametros);
  }

//Para Obtener Artiuculos por Id
obtenerArticuloId(idProducto:number): Observable<any>{
const parametros = {
  id_existencia: idProducto,
  id_comprador: 1,
  token: '012354SDSDS01',
  id_almacen: 1,
};
return this.http.post<any>(SERVER_API,parametros)

}


  //Para guardar productos
  vaciarForm = false;
  agregarProducto(producto: Product) {
    let url =
      'https://serp-inventarios.serteza.com/public/api/articulos/guardarArticulo';

    return this.http.post(url, producto).pipe(
      map((resp :any) => {
        if(resp.ok){
          //console.log('service',resp);
          Swal.fire('Exito al crear el Articulo', '', 'success');
          this.vaciarForm = true;
          return resp.data;
        }else {
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
        Swal.fire('Error al crear el producto', err.error.message, 'error');
        return throwError(err);
      })
    );
  }

//VaciarForm
vForm(){
  if(this.vaciarForm){
    this.productForm.reset();
this.vaciarForm = false;
  }
}


  //Para Guardar Fotografias
  guardarFotos(id_articulo : any, fotos :any): Observable<any>{
    let url ='https://serp-inventarios.serteza.com/public/api/articulos/guardarFotografia';
   const observables = fotos.map((foto:string)=>{
    let foto_base64 = foto.slice(22);
     const parametros = {
       id_articulo_fotografia: 0,
       id_articulo: id_articulo,
       id_comprador: 1,
       id_fotografia: 0,
       token: "012354SDSDS01",
       foto_base64: foto_base64,
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
