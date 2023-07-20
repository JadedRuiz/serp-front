export class ArticuloPedido {
    constructor(
        public id_det_pedido: number,
        public id_existencia: number,
        public precio_venta: number,
        public costo_promedio: number,
        public cantidad_solicitada: number,
        public tasa_iva: number,
        public precio_total: number,
    ) { }
}