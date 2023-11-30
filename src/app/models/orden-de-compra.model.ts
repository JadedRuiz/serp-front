import { ProductProv } from "./producto-proveedor";
export class OrdenDeCompra {
  constructor(
    public id_compra : number,
    public id_almacen : number,
    public id_proveedor : number,
    public id_moneda : number,
    public token : string,
    public forma_pago : string,
    public dias_credito : number,
    public tipo_cambio : number,
    public fecha_entrega : string,
    public observaciones : string,
    public id_usuario : string,
    public articulos : ProductProv
    ){}
}
