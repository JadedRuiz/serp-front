import { VisitasDTO } from "./visitas.model";

export class VendedorVisitas {
    constructor(
        public id_vendedor: number,
        public vendedor: string,
        public visitas: VisitasDTO[]
        ){}
  }
  