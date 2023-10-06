import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-base-logged',
  templateUrl: './base-logged.component.html',
  styleUrls: ['./base-logged.component.scss'],
  animations: [ ]
})

export class BaseLoggedComponent implements OnInit {
  //#region [Variables globales]
    //show_menu = true;
  imagenLogo = 'http://www.ligayucatan.org/assets/logos/logo.png';

  constructor(
    private router: Router,

  ){

  }

  ngOnInit(): void {

  }

  reglamento(){
    this.router.navigate(['/sis_koonol/catalogos/reglamento']);

  }
  home(){
    this.router.navigate(['/sis_koonol/catalogos']);

  }

}
