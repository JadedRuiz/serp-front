import { ArticuloPedido } from "./articulopedido.model";

export class Pedido {
    constructor(
        public id_pedido: number,
        public id_almacen: number,
        public id_cliente_direccion: number,
        public id_vendedor: number,
        public id_cliente: number,
        public id_usuario: number,
        public id_status: number,
        public token: string,
        public fecha_entrega: string,
        public observaciones: string,
        public folio: string,
        public fecha_pedido: string,
        public facturado: string,
        public status: string,
        public cliente: string,
        public peso_producto: number,
        public precio_total: number,
        public num_productos: number,
        public articulos: ArticuloPedido[]
    ) { }
}