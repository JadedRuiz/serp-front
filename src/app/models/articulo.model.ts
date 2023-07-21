import { Foto } from "./fotografias.model";

export class Articulo {
  constructor(
    public id_existencia: number,
    public id_articulo: number,
    public id_familia: number,
    public familia: string,
    public articulo: string,
    public codigo_barras: string,
    public tasa_iva: number,
    public existencia: number,
    public pedidos: number,
    public disponible: number,
    public id_medida: number,
    public precio_venta: number,
    public medida: string,
    public familiaActiva: boolean,
    public quantity: number,
    public imagenes: Foto[],
    public costo_promedio: number,
    public precio_total: number,
    public precio_total_formateado: string,
  ) { }
}
