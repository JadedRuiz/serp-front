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
  {}

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

  //Activo
  routeIsActive: boolean = false;
//Este metodo
  obtenerRutas() {
    this.routeService.obtenerRutas().subscribe(
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


//Activo
updateRouteStatus() {
  this.filteredRoutes.forEach(route => {
    if (route.activo === 1) {
      route.routeIsActive = true;
    } else {
      route.routeIsActive = false;
    }
  });
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

  editarRuta(route: any) {
    this.openModal();
    console.log(route);
    this.route = route;
  }

  guardarRuta(routeForm: NgForm) {
    if (routeForm.invalid) {
      return;
    }
    if (this.route.id_ruta) {
      console.log(this.route.id_ruta);
      this.routeService
        .editarRuta(this.route.id_ruta, this.route)
        .subscribe((objeto) => {});
      this.closeModal();
    } else {
      this.routeService.agregarRuta(this.route).subscribe((objeto) => {
        console.log('este soy yo' + objeto);
        this.routeService.obtenerRutas();
        this.closeModal();
      });
    }
    console.log(this.route);
  }

  deleteRuta(id: number) {
    Swal.fire({
      title: '¿Quieres desactivar esta Ruta?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Activar',
      denyButtonText: `Desactivar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.routeService.eliminarRuta(id).subscribe((objeto) => {
          console.log(objeto);
          this.routeService.obtenerRutas();
        });
      }
    });
  }


//Activar RUTA
  deshabilitarRuta(id_ruta: number, activo: number) {
    this.routeService.desactivarRuta(id_ruta).subscribe((objeto) => {
      this.obtenerRutas();
      console.log(this.route);
    });
    // this.routeService.obtenerRutas();
  }

  getRouteStatusClass(activo: number): string {
    return activo == 1 ? 'btn-success' : 'btn-danger';
  }

  getRouteStatusText(activo: number): string {
    return activo == 1 ? 'Activado' : 'Desactivado';
  }
}

