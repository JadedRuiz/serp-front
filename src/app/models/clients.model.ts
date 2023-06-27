import { Address } from "./addresses.model";

export class Client {
    constructor(
        public id_cliente_direccion: number,
        public id_cliente: number,
        public id_comprador: number,
        public token: string,
        public cliente: string,
        public contacto: string,
        public rfc: string,
        public celular: string,
        public telefono: string,
        public correo: string,
        public id_ruta: number,
        public id_regimenfiscal: number,
        public descuento1: number,
        public descuento2: number,
        public descuento3: number,
        public id_usuario: number,
        public activo: number,
        public domicilio: Address
    ) { }
}