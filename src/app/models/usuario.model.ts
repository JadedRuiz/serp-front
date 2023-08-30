import {Almacen} from "./almacen.model";

export class Usuario {
    constructor(
        public id_usuario: number,
        public id_comprador: number,
        public token: string,
        public nombre: string,
        public usuario: string,
        public password: string,
        public id_perfil: number,
        public activo: number,
        public id_usuario_guardar: number,
        public id_fotografia: number,
        public extencion: string,
        public foto_base64: string,
        public id_usuario_consulta: number,
        public almacenes: {}[]
    ) { }
}
