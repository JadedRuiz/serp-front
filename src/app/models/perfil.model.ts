
export class Perfil{
  constructor(
    public id_perfil: number,
    public perfil: string,
    public descripcion: string,
    public fecha_creacion: string,
    public fecha_mod: string,
    public usuario_creacion: number,
    public usuario_mod: string,
    public activo: number,
  ){}
}
