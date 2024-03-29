import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';
import { Router } from '@angular/router';
import { AuthService } from '@data/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm : FormGroup;

  constructor(
    private _fb : FormBuilder,
    private router : Router,
    private auth : AuthService
  ) {
    this.loginForm = this._initForm();
    Notiflix.Notify.init({
      width: '300px',
      position: 'center-bottom',
      closeButton: false
    });
  }

  ngOnInit() : void { }

  private _initForm() {
    return this._fb.group({
      usuario : ['',Validators.required],
      password : ['', Validators.required]
    });
  }

  onSubmitForm(){
    Swal.fire('Bien hecho','Te has logueado correctamente, redireccionando ...');
    const data = { ... this.loginForm.value }
    if(this.loginForm.valid){
      this.router.navigate(["sis_koonol/catalogos"]);
      localStorage.setItem("dataPage",'{"id_usuario": 1,"token":"a5a81a5sd16234a6s5d","id_almacen":0}');
    }else{
      Notiflix.Block.remove(".form_login");
      Notiflix.Notify.warning("Primero llena los campos obligatorios");
    }
  }
}


