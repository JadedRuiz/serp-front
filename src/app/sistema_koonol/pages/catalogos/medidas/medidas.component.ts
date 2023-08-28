import { Component } from '@angular/core';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { Route } from 'src/app/models/routes.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MedidaService } from 'src/app/services/medidas/medida.service';
import { Medida } from 'src/app/models/medidas.model';

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent {
  routes: any[] = [];
  medidas: any[]= [];
  searchRoute: string = '';
  filteredMedidas: any[] = [];
  resultsNotFound: boolean = false;
  isModalOpen: boolean = false;

  constructor(
    private medidasService: MedidaService,
    private routeService: RoutesService
    )
  { }

  route: Route = new Route(0, 1, '', '', 1, 1);
  medida: Medida = new Medida(0,0,'',0,'',0,0,0,'','','');

  ngOnInit() {
    this.obtenerMedidas();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }




  //Obtener MEDIDAS
  obtenerMedidas() {
    let json = {
      id_ruta: 0,
      id_comprador: 1,
      token: '012354SDSDS01',
      ruta: '',
    };
    this.medidasService.obtenerMedidas(json).subscribe(
      (response) => {
        if (response.ok) {
          this.medidas = response.data;
          this.filteredMedidas = this.medidas;
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
      this.filteredMedidas = this.medidas;
    } else {
      this.filteredMedidas = this.medidas.filter((route) =>
        route.ruta.toLowerCase().includes(this.searchRoute.toLowerCase())
      );
    }
    this.noResults();
  }

  noResults() {
    if (this.filteredMedidas.length === 0) {
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
        .subscribe((objeto) => {
          this.closeModal();
        });
    } else {
      this.routeService.agregarRuta(this.route).subscribe((objeto) => {
        this.closeModal();
      });
    }
  }



  //Activar RUTA
  deshabilitarRuta(id_ruta: number, activo: number) {
    let textoAlert = activo == 1 ? '¿Quieres DESACTIVAR la media?' : '¿Quieres ACTIVAR la medida?'
    Swal.fire({
      title: textoAlert,
      showDenyButton: true,
      confirmButtonText: 'SI',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.routeService.desactivarRuta(id_ruta, activo).subscribe((objeto) => {
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
    this.filteredMedidas.forEach(route => {
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
