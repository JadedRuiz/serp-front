import { Component, OnInit } from '@angular/core';
import { RegistroService } from 'src/app/services/registro/registro.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

 imagen = 'http://www.ligayucatan.org/assets/logos/logo.png'
  Categorias : any;
  isModalOpen: boolean = false;


  constructor(
    private registro_service : RegistroService,
    private router : Router


  ){}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(){
    this.Categorias = [];
    this.registro_service.catalogoCategorias()
    .subscribe((object : any) => {
      if(object.ok){
        this.Categorias = object.data;
        console.log('this.Categorias :>> ', this.Categorias);
      }
    });
  }



   openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  partidos(){
    this.router.navigate(['/sis_koonol/catalogos/partidos']);

  }

}
