import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visita-cliente',
  templateUrl: './visita-cliente.component.html',
  styleUrls: ['./visita-cliente.component.scss']
})
export class VisitaClienteComponent {

  //Ubicacion var
  ubicacionVendedor : any ;


  guardarUbi(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        this.ubicacionVendedor = {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude
        };
        Swal.fire('Ubicacion guardada correctamete', '', 'success');
        console.log('ubi :>> ', this.ubicacionVendedor);
      },
      (error) => {
        console.log(error);
      });
    }
  }


}
