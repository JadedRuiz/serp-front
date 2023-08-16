import { Component } from '@angular/core';
import { GeolocationService } from './services';
import { GoogleMap, MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent {

  constructor(private geolocationService: GeolocationService) { }

  coords: number[] = [];
  long: number = 0;
  lat: number = 0;
  center: any = { lat: 0, lng: 0 }
  map: any;
  marker: google.maps.Marker = new google.maps.Marker();

  ngOnInit(): void {
    this.geolocationService.getUserLocation()
      .then(resp => {
        //ASIGNANDO COORDENADAS
        this.coords = resp;
        this.long = this.coords[0];
        this.lat = this.coords[1];

        //CENTRO DEL MAPA
        this.center = { lat: this.lat, lng: this.long };

        //CREANDO MAPA
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          zoom: 18.5,
          center: this.center,
          mapTypeControl: false,
        });

        let map = this.map
        this.marker = new google.maps.Marker({
          map,
          draggable: true,
          position: this.center
        });

        //ACTUALIZAR LA LOCALIZACIÓN DEL PIN CON LA UBICACIÓN ACTUAL
        this.geolocationService.updatePinLocation([this.long, this.lat]);

        //INICIALIZAR EL MAPA
        this.initMap();

        //SUSCRIPCIÓN A LOS CAMBIOS QUE EXISTAN EN LA UBICACIÓN DEL PIN
        this.geolocationService.pinLocation$.subscribe(data => {
          this.long = data[0]
          this.lat = data[1]
          this.pinPositionChanged()
        });
      })
  }


  //INICIALIZACIÓN DEL MAPA
  initMap(): void {
    let map: google.maps.Map = this.map
    let marker: google.maps.Marker = this.marker

    
    //FUNCIÓN PARA QUE AL ARRASTRAR EL PIN A ALGUNA PARTE DEL MAPA NOS REDIRIJA ALLÍ Y SE ACTUALICE LA LOCALIZACIÓN DEL PIN
    marker.addListener('dragend', () => {
      const newPosition = marker.getPosition()!;
      const lat = newPosition.lat();
      const lng = newPosition.lng();
      map.setCenter(newPosition);
      this.geolocationService.updatePinLocation([lng, lat]);
    });

    //FUNCIÓN PARA QUE AL HACER CLICK EN ALGUNA PARTE DEL MAPA NOS REDIRIJA ALLÍ Y SE ACTUALICE LA LOCALIZACIÓN DEL PIN
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const newPosition = event.latLng!;
      map.setCenter(newPosition);
      marker.setPosition(newPosition);
      const lat = newPosition.lat();
      const lng = newPosition.lng();
      this.geolocationService.updatePinLocation([lng, lat]);
    });
  }

  pinPositionChanged() {
    this.marker.setPosition({ lat: this.lat, lng: this.long });
    this.map.setCenter({ lat: this.lat, lng: this.long });
    this.map.setZoom(16.5)
  }
}
