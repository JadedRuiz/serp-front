import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';



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

      this.famService.editarFam(this.familiaForm).subscribe({
        next: (response) => {
          if (response.ok == 'true')
          {
            console.log('Familia editada exitosamente:', response.data.message);
            Swal.fire('Éxito', response.data.message, 'success').then(() => {
              this.router.navigate(['/buscador'])
            });
          } else
          {
            Swal.fire('Error', 'al editar la familia', 'error');
            console.error('Error al editar la familia:', response.data.message);
          }
        },
        error: (error) => {
          Swal.fire('Error', 'al editar la familia', 'error');
          console.error('Error al editar la familia:', error);
        }

      });
    }
  }

}
