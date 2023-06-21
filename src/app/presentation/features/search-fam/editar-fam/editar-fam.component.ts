import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-fam',
  templateUrl: './editar-fam.component.html',
  styleUrls: ['./editar-fam.component.scss']
})
export class EditarFamComponent implements OnInit {
  familiaForm!: FormGroup;
  familiaId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private famService: FamiliaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.getFamiliaId();
  }

  initForm() {
    this.familiaForm = this.formBuilder.group({
      familia: ['', Validators.required]
    });
  }

  getFamiliaId() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.familiaId = id !== null ? +id : 0;
    });
  }

  guardarCambios() {
    if (this.familiaForm.valid) {
      const familia = {
        familia: this.familiaForm.controls['familia'].value,
        id_familia: this.familiaId,
        id_comprador: 1,
        token: '012354SDSDS01',
        id_usuario: 1,
        activo: 1
      };

      this.famService.editarFam(familia).subscribe({
        next: (response) => {
          if (response.ok === 'true') {
            console.log('Familia editada exitosamente:', response.data.message);
            // redireccionar
          } else {
            console.error('Error al editar la familia:', response.data.message);
          }
        },
        error: (error) => {
          console.error('Error al editar la familia:', error);
        }
      });
    }
  }

}
