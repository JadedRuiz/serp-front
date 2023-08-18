import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {

  public userLocation?: [number, number]
  private markerLocationSubject = new BehaviorSubject<[number, number]>([0, 0]);
  markerLocation$ = this.markerLocationSubject.asObservable()

  get isUserLocationReady(): boolean {
    return !!this.userLocation
  }

  constructor() { this.getUserLocation() }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude]
          resolve(this.userLocation)
        },
        (err) => {
          console.log(err);
        }
      )
    });

  }

  //ACTUALIZAR LA UBIACCIÓN DEL PUNTERO EN EL MAPA
  updateMarkerLocation(markerLocation: [number, number]): void {
    this.markerLocationSubject.next(markerLocation)
  }

  //OBTENER LA UBICACIÓN DEL PUNTERO EN EL MAPA
  async getMarkerLocation() {
    return this.markerLocationSubject.value
  }
  
}
