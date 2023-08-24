import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapRoute } from 'src/app/models/map-route.model';

@Injectable({
  providedIn: 'root'
})

export class MapRoutesService {

  private routesSubject = new BehaviorSubject<MapRoute[]>([]);
  routes$ = this.routesSubject.asObservable()

  //ACTUALIZAR LAS RUTAS DEL MAPA
  updateRoutes(routes: MapRoute[]): void {
    this.routesSubject.next(routes)
    console.log(this.routes$);
  }
}
