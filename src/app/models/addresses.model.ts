import { Foto } from "./fotografias.model";

export class Address {
    constructor(
        public id_cliente_direccion: number,
        public id_cliente: number ,
        public id_direccion: number,
        public id_ruta: number,
        public direccion: string,
        public descripcion: string,
        public calle: string,
        public numero_interior: string,
        public numero_exterior: string,
        public cruzamiento_uno: string,
        public cruzamiento_dos: string,
        public codigo_postal: number,
        public colonia: string,
        public localidad: string,
        public municipio: string,
        public estado: string,
        public longitud: string,
        public latitud: string,
        public activo: number,
        public fotos: Foto[]
    ) {}
}
