import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';


@Component({
  selector: 'app-editar-fam',
  templateUrl: './editar-fam.component.html',
  styleUrls: ['./editar-fam.component.scss']
})
export class EditarFamComponent implements OnInit {
  forms_validation! : FormGroup;
  familiaForm = {
    familia : "",
    id_familia: 0,
    id_comprador: 1,
    token: '012354SDSDS01',
    id_usuario: 1,
    activo: 1
  } ;

  constructor(
    private router_params : ActivatedRoute,
    private router: Router,
    private famService: FamiliaService,
    private formBuilder: FormBuilder
  ) {

    this.familiaForm.id_familia = parseInt(this.router_params.snapshot.paramMap.get('idFamilia')+"");
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.forms_validation = this.formBuilder.group({
      familia: ['', Validators.required]
    });
  }



  guardarCambios() {
    if (this.familiaForm.familia != "") {

      let respuesta = this.famService.editarFam(this.familiaForm);
      respuesta.subscribe( (resp : any) => {
        if(resp.ok){
          console.log('Familia editada exitosamente:', resp.data.message);
            Swal.fire("REGISTRO GUARDADO", resp.data["id_familia"], 'success').then(() => {
              this.router.navigate(['/buscador'])
           });
        }else{
          if(resp.ok == false){
            Swal.fire("REGISTRO CON ERROR "+resp.data["message"], "ERROR", 'error').then(() => {
              this.router.navigate(['/buscador'])
           });

        }else{
          Swal.fire("REGISSTRO CON ERROR");}
        
        }
      });





    }
  }

}
