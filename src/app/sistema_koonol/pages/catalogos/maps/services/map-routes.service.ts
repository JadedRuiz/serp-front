import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapRoutesService {

  private routesSubject = new BehaviorSubject<[]>([]);
  routes$ = this.routesSubject.asObservable()

  //ACTUALIZAR LAS RUTAS DEL MAPA
  updateMarkerLocation(routes:[]): void {
    this.routesSubject.next(routes)
  }
}
