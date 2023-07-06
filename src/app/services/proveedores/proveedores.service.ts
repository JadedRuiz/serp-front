import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { SERV_PROV } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) { }


  //=>
  obtenerProveedores(): Observable<any> {
    const parametros = {
      id_cliente_direccion: 0,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    };
    return this.http.post<any>(SERV_PROV, parametros);
  }

// =>
desactivarProveedores(id_proveedor:number, activo:number){
  let url = 'https://serp-inventarios.serteza.com/public/api/proveedores/activarProveedor?id_proveedor=' + id_proveedor;
  return this.http.post(url, '').pipe(
    map((object : any) =>{
      let mensaje = activo === 0 ? 'ACTIVADO' : 'DESACTIVADO' ;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `El proveedor fue ${mensaje}`,
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(object);
      return object.data;
    }),
    catchError((error: any) => {
      // Mostrar el mensaje de error en un cuadro de diálogo o en la consola
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error en la solicitud.',
      });
      console.error(error);
      // Propagar el error para que se maneje en el componente que llama a esta función
      return throwError(error);
    })
  )
}





editarProveedor(id: number, proveedor: any) {
  let url = 'https://serp-inventarios.serteza.com/public/api/proveedores/guardarProveedor';
  return this.http.post( url, proveedor )
  .pipe(map( (resp: any) => {
    return resp;
  }), catchError(err => {
    Swal.fire("Ha ocurrido un error", err.error.message, 'error');
    return throwError(err);
  }));
}


  agregarProveedor(proveedor: Proveedor) {
    let url = 'https://serp-inventarios.serteza.com/public/api/proveedores/guardarProveedor';

    return this.http.post(url, proveedor)
      .pipe(
        map((resp: any) => {
          console.log(resp);
          Swal.fire('Proveedor creado exitosamente', '', 'success');
          return resp.data;
        }),
        catchError(err => {
          Swal.fire('Error al crear proveedor', err.error.message, 'error');
          return throwError(err);
        })
      );
  }


}
