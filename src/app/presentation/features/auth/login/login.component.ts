import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm : FormGroup;

  constructor(
    private _fb : FormBuilder,
    private router : Router
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
      user : [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password : ['', Validators.required]
    });
  }

  onSubmitForm(){
    Notiflix.Block.circle(".form_login");
    if(this.loginForm.valid){
      const data = { ... this.loginForm.value }
      setTimeout(() => {
        Notiflix.Block.remove(".form_login");
        Notiflix.Notify.success("Te has logueado correctamente, redireccionando ...");
        localStorage.setItem("token","sKKKASD10239AK120Djkahsda9s8d12jk");
        this.router.navigate(["home"]);
      }, 1000);
      return;
    }
    setTimeout(() => {
      Notiflix.Block.remove(".form_login");
      Notiflix.Notify.warning("Primero llena los campos obligatorios");
    }, 1000);
  }
}
