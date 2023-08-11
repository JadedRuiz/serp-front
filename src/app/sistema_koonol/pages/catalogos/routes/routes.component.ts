import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { Route } from 'src/app/models/routes.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent {
  routes: any[] = [];
  searchRoute: string = '';
  filteredRoutes: any[] = [];
  resultsNotFound: boolean = false;
  isModalOpen: boolean = false;

  constructor(private routeService: RoutesService) // private router: Router,
  // private http: HttpClient
  { }

  route: Route = new Route(0, 1, '', '', 1, 1);

  ngOnInit() {
    this.obtenerRutas();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }




  //Obtener Rutas
  obtenerRutas() {
   let json = {
      id_ruta: 0,
      id_comprador: 1,
      token: '012354SDSDS01',
      ruta: '',
    };
    this.routeService.obtenerRutas(json).subscribe(
      (response) => {
        if (response.ok) {
          this.routes = response.data;
          this.filteredRoutes = this.routes;
          this.updateRouteStatus();
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }





  //FILTRO
  filtrarRutas() {
    if (this.searchRoute === '') {
      this.filteredRoutes = this.routes;
    } else {
      this.filteredRoutes = this.routes.filter((route) =>
        route.ruta.toLowerCase().includes(this.searchRoute.toLowerCase())
      );
    }
    this.noResults();
  }

  noResults() {
    if (this.filteredRoutes.length === 0) {
      this.resultsNotFound = true;
    } else {
      this.resultsNotFound = false;
    }
  }

  //=> editar ruta
  editarRuta(route: any) {
    this.openModal();
    this.route = route;
  }

  guardarRuta(routeForm: NgForm) {
    if (routeForm.invalid) {
      return;
    }
    if (this.route.id_ruta) {
      this.routeService
        .editarRuta(this.route.id_ruta, this.route)
        .subscribe((objeto) => { });
      this.obtenerRutas();
      this.closeModal();
    } else {
      this.routeService.agregarRuta(this.route).subscribe((objeto) => {
        this.obtenerRutas();
        this.closeModal();
        this.obtenerRutas(); //<=
      });
    }
  }



  //Activar RUTA
  deshabilitarRuta(id_ruta: number, activo: number) {
    let textoAlert = activo == 1 ? '¿Quieres DESACTIVAR la ruta?' : '¿Quieres ACTIVAR la ruta?'
    Swal.fire({
      title: textoAlert,
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.routeService.desactivarRuta(id_ruta, activo).subscribe((objeto) => {
          this.obtenerRutas();
        });
        // Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los cambios', '', 'info')
      }
    })

  }


  //Activo
  routeIsActive: boolean = false;
  updateRouteStatus() {
    this.filteredRoutes.forEach(route => {
      if (route.activo === 1) {
        route.routeIsActive = true;
      } else {
        route.routeIsActive = false;
      }
    });
  }

  getRouteStatusClass(activo: number): string {
    return activo == 1 ? 'btn-success' : 'btn-danger';
  }

  getRouteStatusText(activo: number): string {
    return activo == 1 ? 'ACTIVADA' : 'DESACTIVADA';
  }
}

