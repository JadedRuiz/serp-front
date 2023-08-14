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
  center: any;

  ngOnInit(): void {
    this.geolocationService.getUserLocation()
      .then(resp => {
        console.log(resp);
        this.coords = resp
        this.long = this.coords[0]
        this.lat = this.coords[1]
        this.center = { lat: this.lat, lng: this.long }
        this.geolocationService.updatePinLocation([this.long, this.lat])
        this.initMap()
      })
  }

  initMap(): void {
    let map: google.maps.Map;
    let marker: google.maps.Marker;

    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      zoom: 18.5,
      center: this.center,
      mapTypeControl: false,
    });

    marker = new google.maps.Marker({
      map,
      draggable: true,
      position: this.center
    });

    //FUNCIÓN PARA QUE AL HACER CLICK EN ALGUNA PARTE DEL MAPA NOS REDIRIJA ALLÍ Y SE ACTUALICE LA LOCALIZACIÓN DEL PIN
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      this.geocode({ location: e.latLng }, map, marker);
    });

    // this.geolocationService.pinLocation$.subscribe((data) => {
    //   map.setCenter({lat: data[0], lng: data[1]})
    //   marker.setPosition({lat: data[0], lng: data[1]})
    // })
  }

  geocode(request: google.maps.GeocoderRequest, map: google.maps.Map, marker: google.maps.Marker): void {
    let geocoder: google.maps.Geocoder;

    geocoder = new google.maps.Geocoder();

    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        console.log(result);
        map.setCenter(results[0].geometry.location);
        marker.setPosition(results[0].geometry.location);
        marker.setMap(map);
        let lat = results[0].geometry.location.lat()
        let lng = results[0].geometry.location.lng()

        this.geolocationService.updatePinLocation([lng, lat])
        return results;
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }
}
