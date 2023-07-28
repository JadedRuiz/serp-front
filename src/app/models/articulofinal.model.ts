export class ArticuloFinal {
    constructor(
        public id_pedido: number,
        public id_cliente_direccion: number,
        public id_status: number,
        public folio: string,
        public fecha_pedido: string,
        public fecha_entrega: string,
        public observaciones: string | null,
        public id_vendedor: number,
        public facturado: string,
        public status: string,
        public id_cliente: number,
        public cliente: string,
        public articulo: string,
        public id_medida: number,
        public medida: string,
        public precio_total: number,
        public cantidad_solicitada: number,
        public peso_producto: number,
    ) { }
}