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
    public calle: string,
    public numero_exterior: string,
    public numero_interior: string,
    public cruzamiento_uno: string,
    public cruzamiento_dos: string,
    public colonia: string,
    public municipio: string,
    public codigo_postal: number,
    public empresa : string
  ) {}
}
