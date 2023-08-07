export class CobranzaDto {
  constructor(

     public id_cobranza: number ,
     public id_comprador: number ,
     public id_pedido: number ,
     public token: string,
     public cobratario: string,
     public importe_pagado: number,
     public pago_1000: number,
     public pago_500: number,
     public pago_200: number,
     public pago_100: number,
     public pago_50: number,
     public pago_20: number,
     public pago_10: number,
     public pago_5: number,
     public pago_2: number,
     public pago_1: number,
     public cambio_1000: number,
     public cambio_500: number,
     public cambio_200: number,
     public cambio_100: number,
     public cambio_50: number,
     public cambio_20: number,
     public cambio_10: number,
     public cambio_5: number,
     public cambio_2: number,
     public cambio_1: number,
     public id_usuario: number

  ) {}
}
