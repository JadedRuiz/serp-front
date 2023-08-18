import { adress_Almacen } from "./adress-almacen.model";

export class Almacen {
  constructor(
    public id_almacen: number,
    public id_comprador: number,
    public id_direccion: number,
    public id_empresa: number,
    public empresa: string,
    public direccion: string,
    public token: string,
    public almacen: string,
    public id_usuario: number,
    public activo: number,
    public domicilio: adress_Almacen,
    public selected?: boolean,
    public id_usuario_almacen?: number,
  ) {}
}
