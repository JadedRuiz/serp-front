export class Vendedor {
  constructor(
    public id_vendedor: number,
    public id_comprador: number,
    public vendedor: '',
    public token: '',
    public id_usuario: number,
    public activo: number,
    public usuario?: string,
    public id_usuario_relacionado?: number,

  ){}
}
