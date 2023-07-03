export class Almacen {
  constructor(
    public id_almacen: number,
    public id_comprador: number,
    public almacen: string,
    public solo_activos: number,
    public token: string,
    public descripcion: string,
    public id_direccion: number,
    public direcion: '',
    public calle: number,
    public numero_exterior: number,
    public numero_interior: number,
    public cruzamiento_uno: number,
    public cruzamiento_dos: number,
    public colonia: string,
    public municipio: string,
    public codigo_postal: number,
    public empresa : string
  ) {}
}
