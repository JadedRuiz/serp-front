import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Vendedor } from 'src/app/models/vendedor.model';
import { SERV_VENDEDORES } from 'src/config/config';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VendedoresService {

  constructor(private http: HttpClient) { }

  //Obtener Vendedores
  obtenerVendedores(): Observable<any> {
    const parametros = {
      id_vendedor: 0,
      id_comprador: 1,
      vendedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };

    return this.http.post<any>(SERV_VENDEDORES, parametros);
  }


// Editar Vendedores
editarVendedor(id_vendedor: number, vendedor: any){
let url = 'https://serp-inventarios.serteza.com/public/api/vendedores/guardarVendedor';
return this.http.post(url, vendedor).pipe(map( (resp:any)=> {
  return resp;
}), catchError(err => {
  Swal.fire("Ha ocurrido un error", err.error.message, 'error');
  return throwError(err);
}));
}

// Agrega Vendedor
agregarVendedor(vendedor: Vendedor){
let url = 'https://serp-inventarios.serteza.com/public/api/vendedores/guardarVendedor';
return this.http.post(url, vendedor).pipe(
  map((resp:any)=> {
    console.log(resp);
    Swal.fire('Vendedor creado con exito', '', 'success');
    return resp.data;
    }), catchError(err =>{
      Swal.fire('Error al crear vendedor', err.error.message,'error')
      return throwError(err);
    })
)
}

// Activa el Vendedor
activarVendedor(id_vendedor:number, activo:number){
  let url = 'https://serp-inventarios.serteza.com/public/api/vendedores/activarVendedor?id_vendedor=' + id_vendedor;
  return this.http.post(url,'').pipe(
    map((objeto :any)=>{
      let mensaje = activo == 0? ' activado ' : ' desactivado ';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Vendedor'+ mensaje +'con exito',
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(objeto);
      return objeto.data;
    }),
    catchError((error : any)=>{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: 'Ha ocurrido un error'
    })
    console.error(error);
    return throwError(error);
  })
  )
}


}

