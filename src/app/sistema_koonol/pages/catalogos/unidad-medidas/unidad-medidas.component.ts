import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MedidaService } from 'src/app/services/medidas/medida.service';
import Swal from 'sweetalert2';
import { Medida } from 'src/app/models/medidas.model';

@Component({
  selector: 'app-unidad-medidas',
  templateUrl: './unidad-medidas.component.html',
  styleUrls: ['./unidad-medidas.component.scss']
})
export class UnidadMedidasComponent {

    medidas: any[] = [];
    searchRoute: string = '';
    filteredRoutes: any[] = [];
    resultsNotFound: boolean = false;
    isModalOpen: boolean = false;

    constructor(
      private medidasService: MedidaService
      )
    { }

    medida: Medida = new Medida(0, 1, '', 1,'token',0,0,0,'','','','');

    ngOnInit() {
      this.obtenerMedidas();
      this.medidaSat();
    }

    openModal() {
      this.isModalOpen = true;
    }

    closeModal() {
      this.isModalOpen = false;
    }


    // MEDIDAS SAT - SEC
    medidasSEC: any[] = [];
    medidasSAT: any[] = [];
    medidaSat(){
      let json = {
        id_medida_sat: 0,
        medida_sat: "",
        solo_activos: 1,
        token: "012354SDSDS01"
      }
      this.medidasService.medidasSAT(json).subscribe((resp)=>{
        if(resp.ok){
          this.medidasSAT= resp.data
        }
      })

    }

    //obtener Medidas
    obtenerMedidas() {
      let json = {
        id_medida: 0,
        id_comprador: 1,
        medida: "",
        solo_activos: 1,
        token: "012354SDSDS01"
      };
      this.medidasService.obtenerMedidas(json).subscribe(
        (response) => {
          if (response.ok) {
            this.medidas = response.data;
            this.filteredRoutes = this.medidas;
            this.medidasSEC = response.data;

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
    filtrarMedidas() {
      if (this.searchRoute === '') {
        this.filteredRoutes = this.medidas;
      } else {
        this.filteredRoutes = this.medidas.filter((medida) =>
          medida.medida.toLowerCase().includes(this.searchRoute.toLowerCase())
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
      this.medidas = route;
    }



//Activar MEDIDA
activMedida(id_medida: number) {
  Swal.fire({
    title: '¿Desactivar medida?',
    showDenyButton: true,
    confirmButtonText: 'SI',
    denyButtonText: `NO`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
    //Agregar logica para activar y desactivar ruta
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

    // GUARDAR MEDIDAS
    guardarMed(medForm: NgForm){
      let json = {
        id_medida: 0,
        id_comprador: 1,
        id_medida_sat: this.medida.id_medida_sat,
        id_medida_sec: this.medida.id_medida_sec,
        token: "012354SDSDS01",
        medida: this.medida.medida,
        cantidad: this.medida.cantidad,
        activo: 1,
        id_usuario: 1,
        etiqueta: this.medida.etiqueta
      }
       this.medidasService.guardarMedidas(json)
       .subscribe(resp => {
         if(resp.ok){
        Swal.fire('Se guardo correctamente', '', 'success')
          this.closeModal();
          this.obtenerMedidas();
         }
       })
    }




  }
