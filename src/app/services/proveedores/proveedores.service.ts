import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { SERV_PROV } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  constructor(private http: HttpClient) { }

  obtenerProveedores(): Observable<any> {
    const parametros = {
      id_cliente_direccion: 0,
      id_comprador: 1,
      cliente: '',
      token: '012354SDSDS01'
    };
    return this.http.post<any>(SERV_PROV, parametros);
  }

  editarProveedor(id: number, proveedor: any) {

      let url = 'https://serp-inventarios.serteza.com/public/api/Proveedores/guardarProveedor';


      return this.http.post( url, proveedor )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        Swal.fire("Ha ocurrido un error", err.error.message, 'error');
        return throwError(err);
      }));
  }

  agregarProveedor(proveedor:Proveedor){
    let url = "https://serp-inventarios.serteza.com/public/api/Proveedores/guardarProveedor"

    return this.http.post(url, proveedor)
    .pipe(map((resp: any) => {
      console.log(resp);
      Swal.fire('Proveedor creado exitosamente', '', 'success')
      return resp.data
    }))
  }

  
}