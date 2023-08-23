import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapRoutesService {

  private routesSubject = new BehaviorSubject<any[]>([]);
  routes$ = this.routesSubject.asObservable()

  //ACTUALIZAR LAS RUTAS DEL MAPA
  updateRoutes(routes: any[]): void {
    this.routesSubject.next(routes)
    console.log(this.routes$);
  }
}
