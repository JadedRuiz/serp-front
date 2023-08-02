export class VisitasDTO {
  constructor(
      public id_visita: number,
      public id_vendedor: number,
      public vendedor: string,
      public id_cliente: number,
      public cliente: string,
      public fecha_visita: string,
      public contacto: string,
      public notas: string,
      public cancelado: number,
      public fecha_siguiente_visita: string,
      public longitud?: any,
      public latitud?: any,
      ){}
}
