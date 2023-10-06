import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as Notiflix from 'notiflix';
import { Router } from '@angular/router';


@Component({
  selector: 'app-base-logged',
  templateUrl: './base-logged.component.html',
  styleUrls: ['./base-logged.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        state('void', style({
          transform : 'translateX(0)',
          opacity : 1
        })),
        transition(':leave', [
          style({transform: 'translateX(0)'}),
          animate('700ms', style({transform: 'translateX(-100%)'}))
        ]),
        transition(':enter', [
          style({transform: 'translateX(-100%)' }),
          animate('700ms', style({transform: 'translateX(0)'}))
        ])
      ]
    )
  ]
})

export class BaseLoggedComponent implements OnInit {
  //#region [Variables globales]
    column_size = "is-10";
    show_menu = true;
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

}
