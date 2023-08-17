import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GeolocationService } from './services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})

export class MapsComponent implements OnInit, OnDestroy {

  //VARIABLES PARA HABILITAR O DESHABILITAR FUNCIONES
  @Input() draggabbleMarker: boolean = false;
  @Input() routesDrawings: boolean = true;

  private unsubscribe$ = new Subject<void>();

  constructor(private geolocationService: GeolocationService) { }

  //COORDENADAS (SE INICIALIZAN CON LA UBICACIÓN ACTUAL DE CLIENTE)
  coords: number[] = [];
  long: number = 0;
  lat: number = 0;

  //MAPA
  map: any;
  //MARCADOR ARRASTRABLE
  draggableMarker: google.maps.Marker = new google.maps.Marker;
  //CENTRO DEL MAPA
  center: google.maps.LatLng = new google.maps.LatLng(0, 0);

  ngOnInit(): void {
    //SE OBTIENE LA UBICACIÓN ACTUAL DEL USUARIO
    this.geolocationService.getUserLocation()
      .then(resp => { //TODO SE EJECUTARÁ DESPUÉS DE HABER OBTENIDO LA UBICACIÓN ACTUAL DEL USUARIO

        //ASIGNANDO COORDENADAS
        this.coords = resp;
        this.long = this.coords[0];
        this.lat = this.coords[1];

        //ASIGNANDO CENTRO DEL MAPA
        this.center = new google.maps.LatLng(this.lat, this.long);

        //CREANDO MAPA
        this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          zoom: 18.5,
          center: this.center,
          mapTypeControl: false,
        });

        //CARGAR LAS FUNCIONES DEL MAPA
        this.chargeMapFunctions();
      })
  }

  ngOnDestroy(): void {
    //DESUSCRIPCIÓN DE VARIABLES DEL SERVICIO
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //CARGA DE LAS FUNCIONES DEL MAPA SEGÚN LAS NECESIDADES DEL COMPONENTE
  chargeMapFunctions(): void {
    let map: google.maps.Map = this.map;

    /*-MARCADOR ARRASTRABLE-*/
    if (this.draggabbleMarker) {

      //CREACIÓN DEL MARCADOR ARRASTRABLE
      this.draggableMarker = new google.maps.Marker({
        map,
        draggable: true,
        position: this.center
      });

      //DECLARACIÓN DE LA VARIABLE MARKER Y ASIGNACIÓN DE SU VALOR COMO DRAGGABLEMARKER
      let marker: google.maps.Marker = this.draggableMarker;

      //FUNCIONES DEL MARCADOR
      this.clickMarkerPosition(map); //Función que se ejecuta al hacer click en el mapa
      this.dragMarkerPosition(map, marker); //Función que se ejecuta al arrastrar el marcador
      this.updateMarkerPosition(this.long, this.lat); //Función que se ejecuta para actualizar la posición del marcador, en este caso con la ubicación actual

      //SUSCRIPCIÓN A LOS CAMBIOS QUE EXISTAN EN LA UBICACIÓN DEL MARCADOR
      this.geolocationService.markerLocation$
      .pipe(takeUntil(this.unsubscribe$)) //Se va a mantener la suscripción hasta se destruya el componente
      .subscribe(coords => {
        this.long = coords[0]; //Asignándole la longitud que se encuentra en la posición 0 del array markerLocation
        this.lat = coords[1]; //Asignándole la latitud que se encuentra en la posición 1 del array markerLocation

        this.markerPositionChanged(); //Función que se ejecuta al haber cambios en markerLocation
      });
    }

    /*-DIBUJOS DE RUTAS-*/
    if(this.routesDrawings) {

    }
  }

  /*---FUNCIONES PARA EL MARCADOR ARRASTRABLE, SU POSICIONAMIENTO Y EFECTOS EN EL MAPA---*/

  //FUNCIÓN QUE AL ARRASTRAR EL MARCADOR A ALGUNA PARTE DEL MAPA NOS REDIRIJE ALLÍ Y ACTUALIZA LA LOCALIZACIÓN DEL MARCADOR
  dragMarkerPosition(map: google.maps.Map, marker: google.maps.Marker) {
    marker.addListener('dragend', () => {
      const newPosition = marker.getPosition()!; //Asignamos la posición que se obtiene del marcador al mover este a algún sitio del mapa
      const lat = newPosition.lat(); //Asignamos la latitud
      const lng = newPosition.lng(); //Asignamos la longitud

      map.setCenter(newPosition); //Actualiza el centro del mapa con la posición nueva
      this.geolocationService.updateMarkerLocation([lng, lat]); //Actualiza la posición del marcador
    });
  }

  //FUNCIÓN QUE AL HACER CLICK EN ALGUNA PARTE DEL MAPA NOS REDIRIJE ALLÍ Y ACTUALIZA LA LOCALIZACIÓN DEL MARCADOR
  clickMarkerPosition(map: google.maps.Map) {
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const newPosition = event.latLng!; //Asignamos la posición que se obtiene al realizar el evento click en algún sitio del mapa
      const lat = newPosition.lat(); //Asignamos la latitud
      const lng = newPosition.lng(); //Asignamos la longitud

      this.geolocationService.updateMarkerLocation([lng, lat]); //Actualiza la posición del marcador
    });
  }

  //ACTUALIZAR LA LOCALIZACIÓN DEL MARCADOR CON UNA POSICIÓN
  updateMarkerPosition(long: number, lat: number) {
    this.geolocationService.updateMarkerLocation([long, lat]);
  }

  //FUNCIÓN QUE MANEJA EL MARCADOR Y MAPA CUANDO HAY ALGÚN CAMBIO EN LA POSICIÓN DE MARKERLOCATION
  markerPositionChanged() {
    this.map.setCenter({ lat: this.lat, lng: this.long }); //Actualiza el centro del mapa con las coordenadas nuevas
    this.map.setZoom(16.5); //Restablece el zoom cada vez que haya algún cambio en la posición del mapa
    this.draggableMarker.setPosition({ lat: this.lat, lng: this.long }); //Actualiza la posición del marcador
  }

  /*---FUNCIONES PARA EL DIBUJO DE RUTAS---*/

  //Próximamente...

}
