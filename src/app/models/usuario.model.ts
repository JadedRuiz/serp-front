export class Usuario {
    constructor(
        public id_usuario: number,
        public id_almacen: number,
        public id_comprador: number,
        public id_perfil: number,
        public usuario: string,
        public password: string,
        public nombre: string,
        public almacenes: any[]
    ) { }
}
