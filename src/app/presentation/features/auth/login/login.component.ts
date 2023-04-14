import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm : FormGroup;

  constructor(
    private _fb : FormBuilder
  ) {
    this.loginForm = this._initForm();
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
    if(this.loginForm.invalid){
      console.log("error");
    }

    const data = { ... this.loginForm.value }
    console.log(data);
  }
}
