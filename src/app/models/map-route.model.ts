export class MapRoute {
    constructor(
        public start: {lat: number, long: number},
        public end: {lat: number, long: number},
        public id_vendedor?: number
    ) {}
}
