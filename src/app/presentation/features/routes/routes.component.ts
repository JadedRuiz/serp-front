import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoutesService } from '@data/services/routes/routes.service';
import { Router } from '@angular/router';

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

  constructor(
    private routeService: RoutesService,
    // private router: Router,
    // private http: HttpClient
  ) { }

  ngOnInit() {
    this.obtenerRutas()
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
    if(this.filteredRoutes.length === 0) {
      this.resultsNotFound = true
    } else {
      this.resultsNotFound = false
    }
  }
}