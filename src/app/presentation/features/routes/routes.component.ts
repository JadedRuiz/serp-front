import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { Route } from 'src/app/models/routes.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})

export class RoutesComponent {
  routes: any[] = [];
  searchRoute: string = '';
  filteredRoutes: any[] = [];
  resultsNotFound: boolean = false;
  isModalOpen: boolean = false

  constructor(
    private routeService: RoutesService,
    // private router: Router,
    // private http: HttpClient
  ) { }

  route: Route = new Route(0, 1, '', '')

  ngOnInit() {
    this.obtenerRutas()
  }

  openModal() {
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
  }

  obtenerRutas() {
    this.routeService.obtenerRutas().subscribe(
      (response) => {
        if (response.ok) {
          this.routes = response.data;
          this.filteredRoutes = this.routes
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error)
      }
    );
  }

  filtrarRutas() {
    if (this.searchRoute === '') {
      this.filteredRoutes = this.routes
    } else {
      this.filteredRoutes = this.routes.filter(route => route.ruta.toLowerCase().includes(this.searchRoute.toLowerCase()))
    }
    this.noResults()
  }

  noResults() {
    if (this.filteredRoutes.length === 0) {
      this.resultsNotFound = true
    } else {
      this.resultsNotFound = false
    }
  }

  editarRuta(route: Route) {
    this.openModal()
    this.route = route
  }

  guardarRuta(routeForm: NgForm) {
    if (routeForm.invalid) {
      return;
    }
    if (this.route.id_ruta) {
      console.log(this.route.id_ruta)
      this.routeService.editarRuta(this.route.id_ruta, this.route)
        .subscribe(objeto => {

        })
        this.closeModal()
    } 
    // else {
    //   this.routeService.agregarRuta(this.route).subscribe(resp => {
    //     this.routeService.obtenerRutas()
    //     this.closeModal()
    //     // console.log(resp)
    //   })
    // }
    console.log(this.route)
  }
}