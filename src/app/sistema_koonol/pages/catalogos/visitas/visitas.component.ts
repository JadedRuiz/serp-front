import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SERV_VISITAS } from 'src/config/config';
import { VisitasDTO } from 'src/app/models/visitas.model';
import { VisitasService } from 'src/app/services/visitas/visitas.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit {

  visitas: VisitasDTO[] = [];
  vendedorActual: any;



  constructor(
    private visitasService: VisitasService,
    private datePipe: DatePipe,
		private router: Router,

    ) { }



  ngOnInit() {
    this.obtenerVisitas();
  }


//Nueva Visita
nuevaVisita(){
 this.router.navigate(['/sis_koonol/catalogos/nueva-visita']);
}


//Transformando fecha Visita
formatearFecha(fecha: any){
  return this.datePipe.transform(fecha, 'dd/MM/yyyy');
}

  //Consultar Visitas
  obtenerVisitas() {
    let json = {
      id_visita: 0,
      id_vendedor: 0,
      id_cliente: 0,
      fecha_inicial: '2023-07-01',
      fecha_final: '2023-07-31',
      token: '012354SDSDS01',
    };

this.visitasService.consultarVisitas(json).subscribe((resp)=>{
  if(resp.ok){
    this.visitas = resp.data;
    if (this.visitas.length > 0) {
      this.vendedorActual = this.visitas[0].vendedor; // Corregimos el nombre de la propiedad
    }
    console.log('visitas :>> ', this.visitas);
  }else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: 'Ha ocurrido un error',
    });
    //console.log(response.message);
  }
})

  }



}
