export class OrdenDeCompra {
  constructor(
    public id : number,
    public folio : string,
    public proveedor : string,
    public fecha_creacion : string,
    public moneda : string,
    public forma_de_pago : string,
    public dias_credito : number,
    public status : number,
    public fecha_entrega : string,
    public observaciones : string,
    ){}
}
