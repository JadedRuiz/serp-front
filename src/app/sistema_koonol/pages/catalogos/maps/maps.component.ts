import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { GeolocationService } from './services';
import { Subject, takeUntil } from 'rxjs';
import {} from '@angular/google-maps'

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

  //VARIABLES GENERALES
  map: any; //Mapa
  @Input() center: google.maps.LatLng = new google.maps.LatLng(20.89115615181602, -89.74665999412537); //Centro del mapa
  @Input() zoom: number = 16 //Zoom del mapa --- Puede venir del componente que lo llame

  directionsService:any;
  directionsRenderer:any;

  ngOnInit(): void {
    this.getUserLocation().then(() => {
      //CREANDO MAPA
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: this.zoom,
        center: this.center,
        mapTypeControl: false,
      });
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);

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
  async chargeMapFunctions() {
    let map: google.maps.Map = this.map;

    /*-MARCADOR ARRASTRABLE-*/
    if (this.draggabbleMarker) {
      //ASIGNANDO CENTRO DEL MAPA
      this.center = new google.maps.LatLng(this.lat, this.long);
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
    if (this.routesDrawings) {
      this.calculateAndDisplayRoute()
    }
  }

  /*---| GEOLOCATION |---*/

  // FUNCIÓN PARA OBTENER LA UBICACIÓN ACTUAL DEL USUARIO
  async getUserLocation() {
    //SE OBTIENE LA UBICACIÓN ACTUAL DEL USUARIO
    await this.geolocationService.getUserLocation()
      .then(resp => {
        //ASIGNANDO COORDENADAS
        this.coords = resp;
        this.long = this.coords[0];
        this.lat = this.coords[1];
      })
  }

  /*---| FUNCIONES PARA EL MARCADOR ARRASTRABLE, SU POSICIONAMIENTO Y EFECTOS EN EL MAPA |---*/

  // VARIABLES
  draggableMarker: google.maps.Marker = new google.maps.Marker; //Marcador arrastrable

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

  /*---| FUNCIONES PARA EL DIBUJO DE RUTAS |---*/

  // VARIABLES
  routes: google.maps.Polyline[] = []; // Array para almacenar las rutas

  // FUNCIÓN PARA DIBUJAR LAS RUTAS EN EL MAPA
  calculateAndDisplayRoute() {
    const start = new google.maps.LatLng(20.891171187091228, -89.74667072296143); // Coordenadas de inicio
    const end = new google.maps.LatLng(20.966533273309683, -89.62413180240539); // Coordenadas de destino

    const request: google.maps.DirectionsRequest = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING // Modo de viaje (DRIVING, WALKING, TRANSIT, BICYCLING)
      
    };

    this.directionsService.route(request, (result:any, status:any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      }
    });
  }


}
