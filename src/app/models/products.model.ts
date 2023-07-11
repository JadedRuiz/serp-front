import { Foto } from "./fotografias.model";

export class Product {
  constructor (
    public id_articulo:number,
    public id_comprador:number,
    public token:string,
    public articulo:string,
    public id_almacen:number,
    public id_medida:number,
    public id_familia:number,
    public id_prodserv_sat:number,
    public tasa_iva:number,
    public codigo_barras:string,
    public activo:number,
    public id_usuario:number,
    public id_existencia:number,
    public precio_venta:number,
    public descuento1:number,
    public descuento2:number,
    public descuento3:number,
    public minimo:number,
    public maximo:number,
    public reorden:number,
    public peso_producto:number,
    public imagenes:Foto[]
  ){}

}
