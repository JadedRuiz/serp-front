export class ProductProv {
  constructor(
    public id_det_compra: number,
    public id_existencia: number,
    public cantidad: number,
    public precio_unitario: number,
    public descuento_1: number,
    public descuento_2: number,
    public descuento_3: number,
    public ieps: number,
    public tasa_iva: number,
  ){}
}
