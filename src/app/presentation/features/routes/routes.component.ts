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

  constructor(
    private routeService: RoutesService,
    // private router: Router,
    // private http: HttpClient
    ) {}

    ngOnInit() {
      this.obtenerRutas()
    }

  obtenerRutas() {
    this.routeService.obtenerRutas().subscribe(
      (response) => {
        // console.log(response)
        if(response.ok) {
          this.routes = response.data;
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error)
      }
    );
  }

}
