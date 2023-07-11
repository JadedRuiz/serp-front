import { Address } from "./addresses.model";

export class Proveedor {
    constructor(
        public id_proveedor: number,
        public id_comprador: number,
        public token: string,
        public proveedor: string,
        public nombre_comercial: string,
        public contacto: string,
        public rfc: string,
        public celular: string,
        public telefono: string,
        public correo: string,
        public direccion: string,
        public descuento1: number,
        public descuento2: number,
        public descuento3: number,
        public id_usuario: number,
        public activo: number,
        public domicilio: Address
    ) { }
}
