import { Component } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import * as Notiflix from 'notiflix';

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
          animate('500ms', style({transform: 'translateX(-100%)'}))
        ]),
        transition(':enter', [
          style({transform: 'translateX(-100%)' }),
          animate('500ms', style({transform: 'translateX(0)'}))
        ])
      ]
    )
  ]
})

export class BaseLoggedComponent {
  //#region [Variables globales]
    column_size = "is-10";
    show_menu = true;

  //#endregion

  ocultarMenu(){
    if(this.show_menu){
      // this.column_size = "is-10";
      this.show_menu = false;
    }else{
      // this.column_size = "is-12";
      this.show_menu = true;
    }

  }


  logout(){
    Notiflix.Confirm.show(
      'Estás a punto de cerrar sesión',
      '¿Estás seguro?',
      'Si',
      'No',
      () => {
        localStorage.removeItem("token");
        location.reload();
      },
      () => {

      },
      {
        backOverlay: true,
        backOverlayColor: 'rgba(0,0,0,0.8)',
        titleColor: '#f34e4e',
        okButtonBackground: '#32c682',
        cancelButtonBackground: '#f34e4e',
      },
      );
  }

}
