import { Component } from '@angular/core';
import { GeolocationService } from './services';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent {

  constructor(private geolocationService: GeolocationService) {}

  coords: number[] = [];
  long: number = 0;
  lat: number = 0;

  ngOnInit(): void {
    this.geolocationService.getUserLocation()
    .then(resp => {
       this.coords = resp
       this.long = this.coords[0]
       this.lat = this.coords[1]
       console.log(this.coords);
       this.center = { lat: this.lat, lng: this.long }
    })
  }

  display:any;
  center: google.maps.LatLngLiteral = { lat: this.lat, lng: this.long }
  zoom = 18.5;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) 
      this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
    this.display = (event.latLng.toJSON());
  }

}
