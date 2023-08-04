import { ArticuloPedido } from "./articulopedido.model";

export class PedidoGuardar {
    constructor(
        public id_pedido: number,
        public id_almacen: number,
        public id_cliente_direccion: number,
        public id_vendedor: number,
        public token: string,
        public fecha_entrega: string,
        public observaciones: string,
        public id_usuario: number,
        public articulos: ArticuloPedido[],
        public precio_total: number,
        public id_visita: number
    ) { }
}