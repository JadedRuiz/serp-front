import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, forkJoin } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { SERVER_API } from 'src/config/config';
import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';

@Injectable({
    providedIn: 'root'
})

export class UsuariosService {
    constructor(private http: HttpClient) { }

    //OBTENER LOS USUARIOS
    obtenerUsuarios(json: any): Observable<any> {
        return this.http.post<any>(SERVER_API + 'usuarios/consultarUsuarios', json);
    }

    // EDITAR UN USUARIO
    editarUsuario(id_usuario: number, usuario: any) {
        let url = SERVER_API + 'usuarios/guardarUsuario';
        return this.http.post(url, usuario).pipe(map((resp: any) => {
            if (resp.ok) {
                Swal.fire('Usuario editado con exito', '', 'success');
                return resp;

            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    text: resp.message || 'Ha ocurrido un error',
                });
            }
        }), catchError(err => {
            Swal.fire("Ha ocurrido un error", err.error.message, 'error');
            return throwError(err);
        }));
    }

    // AGREGAR USUARIO
    agregarUsuario(usuario: Usuario) {
        let url = SERVER_API + 'usuarios/guardarUsuario';
        return this.http.post(url, usuario).pipe(
            map((resp: any) => {
                if (resp.ok) {
                    Swal.fire('Usuario creado con exito', '', 'success');
                    return resp.data;
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error',
                        text: resp.message || 'Ha ocurrido un error',
                    });
                    console.error(resp);
                    return throwError(resp);
                }
            }), catchError(err => {
                Swal.fire('Error al crear usuario', err.error.message, 'error')
                return throwError(err);
            })
        )
    }

    // ACTIVAR UN USUARIO
    activarUsuario(id_usuario: number, activo: number) {
        let url = SERVER_API + 'usuarios/activarUsuario?id_usuario=' + id_usuario;
        return this.http.post(url, '').pipe(
            map((resp: any) => {
                if (resp.ok) {
                    let mensaje = activo == 0 ? 'Activado' : 'Desactivado';
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `El usuario fue ${mensaje}`,
                    });
                    return resp.data;
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error',
                        text: resp.message,
                    });
                }
            }),
            catchError((error: any) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error',
                });
                console.error(error);
                return throwError(error);
            })
        );
    }

    //GUARDAR FOTOS DE UN USUARIO
    guardarFotosUsuario(id_usuario: number, fotos: any[]) {
        let url = SERVER_API + "clientes/guardarFotografia"

        const observables = fotos.map((foto: string) => {
            let foto_base64 = foto.slice(22);
            const parametros = {
                id_cliente_fotografia: 0,
                id_comprador: 1,
                id_usuario: id_usuario,
                id_fotografia: 0,
                token: "012354SDSDS01",
                foto_base64: foto_base64,
                extencion: "JPG"
            }
            return this.http.post(url, parametros).pipe(
                map((resp: any) => {
                    return resp.data
                })
            );
        });
        return forkJoin(observables);
    }
}

