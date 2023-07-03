export class Almacen{
  constructor (
    public id_almacen: number ,
    public id_comprador: number ,
    public almacen: string ,
    public solo_activos: number,
    public token: string
    ){}
}
