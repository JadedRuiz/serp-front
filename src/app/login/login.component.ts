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
    private auth : AuthService,

  ) {
    this.loginForm = this._initForm();
    Notiflix.Notify.init({
      width: '300px',
      position: 'center-center',
      closeButton: false,
      timeout: 1500
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
    this.auth.login(this.loginForm.value)
    .subscribe((resp : any) => {
      if(resp.ok){
        Swal.fire('Bien hecho','Te has logueado correctamente, redireccionando ...');
        localStorage.setItem("dataLogin", JSON.stringify(resp.data[0]));
        this.router.navigate(["sis_koonol/catalogos"]);
        console.log(resp.data);
      }else{
        Notiflix.Block.remove(".form_login");
        Notiflix.Notify.warning(resp.message);
      }
    });
  }
}


