import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';


import { Router } from '@angular/router';
import { AuthService } from '@data/services/auth/auth.service';
import { FamiliasService } from 'src/app/services/familias/familias.service';
import { Familia } from 'src/app/models/familias.model';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-search-fam',
  templateUrl: './search-fam.component.html',
  styleUrls: ['./search-fam.component.scss']
})




export class SearchFamComponent {


  familias: { familia: string, id_familia: number}[] = [];
 // miComprador = window.sessionStorage["comprador_gl"];
miComprador = 1;
isModalOpen = false;
searchText: string = '';



  constructor(
    private router:Router,
    private famService: FamiliasService,
    private http : HttpClient) {}


familia: Familia = new Familia(0, 1, '', '')

ngOnInit(){
  this.buscarFamilias();
}



buscarFamilias() {
  this.famService.obtenerFamilias().subscribe(
    (response) => {
      console.log(response);

      if (response.ok === true) {
        this.familias = response.data;
      } else {
        console.log('Ocurrió un error:', response.message);
      }
    },
    (error) => {
      console.log('Error de conexión:', error);
    }
  );
}

editarFamilia(familia: any){
  console.log(familia);
  this.familia = familia;
}



guardarFamilia(f: NgForm){
if (f.invalid){
  return;
}
if(this.familia.id_familia){
  console.log('numero de ID = ' + this.familia.id_familia);
  this.famService.editarFam(this.familia.id_familia, this.familia)
  .subscribe(objeto =>{
  });
  this.closeModal();

}else{
  this.famService.agregarFam(this.familia).subscribe(objeto  =>{
    console.log('consol OBJETO' + objeto);
    this.famService.obtenerFamilias();
    this.closeModal();
    });
}
console.log(this.familia);
}


deleteFamily(id: number){
  Swal.fire({
    title: '¿Quieres desactivar esta Familia?',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Activar',
    denyButtonText: `Desactivar`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.famService.deleteFamily(id).subscribe(objeto  =>{
        console.log(objeto);
        this.famService.obtenerFamilias();
        })
    }
  })
}


openModal(){
  this.isModalOpen =  true;
}

closeModal(){
  this.isModalOpen = false;
  this.familia = {
    id_comprador : 0,
    familia: '',
    token: '',
    id_familia: 0
  };
}



}







