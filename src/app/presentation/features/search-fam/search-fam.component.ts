import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';


import { Router } from '@angular/router';
import { AuthService } from '@data/services/auth/auth.service';
import { FamiliaService } from '@data/services/sfamilia/familia.service';




@Component({
  selector: 'app-search-fam',
  templateUrl: './search-fam.component.html',
  styleUrls: ['./search-fam.component.scss']
})




export class SearchFamComponent {


  familias: { familia: string, id_familia: number }[] = [];
 // miComprador = window.sessionStorage["comprador_gl"];
  miComprador = 1;
isModalOpen = false;
searchText: string = '';



  constructor(
    private router:Router,
    private famService: FamiliaService,
    private http : HttpClient) {}


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

editarFamilia(familia:any){

  this.router.navigate(['/editar-familia', familia.id_familia]);
}



openModal(){
  this.isModalOpen =  true;
}

closeModal(){
  this.isModalOpen = false;
}

}







