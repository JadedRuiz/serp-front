import { Component } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
import * as Notiflix from 'notiflix';
import * as $ from 'jquery';

@Component({
  selector: 'app-base-logged',
  templateUrl: './base-logged.component.html',
  styleUrls: ['./base-logged.component.scss'],
  animations: [
    trigger('enterAnimation', [
      state(
        'void',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('700ms', style({ transform: 'translateX(-100%)' })),
      ]),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('700ms', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class BaseLoggedComponent {
  //#region [Variables globales]
  column_size = 'is-10';
  show_menu = true;
  bandMenu = true;
  id_usuario = parseInt(localStorage.getItem('id_usuario') + '');
  public usuario = {
    nombre: '',
    ape_paterno: '',
  };
  public perfil = '';
  //#endregion

  tamañoPantalla: any;
  ngOnInit() {
    this.tamañoPantalla = window.screen.width;
    if (this.tamañoPantalla < 768) {
      $('.chiller-theme').removeClass('toggled');
      this.bandMenu = false;
    }
  }

  clickFuera(event: MouseEvent) {
    const cosito = event.target as HTMLElement;
    const hamburguesa = document.querySelector(
      '.sidebar-wrapper'
    ) as HTMLElement;
    console.log('cosito', cosito);

    // if (!hamburguesa.contains(cosito) && this.bandMenu == true) {
    console.log(this.bandMenu);
    $('.chiller-theme').removeClass('toggled');
    this.bandMenu = false;
    console.log(this.bandMenu);
    // } else {
    //   event.stopPropagation();
    // }
  }

  ocultarMenu() {
    if (this.show_menu) {
      this.column_size = 'is-10';
      this.show_menu = false;
    } else {
      this.column_size = 'is-12';
      this.show_menu = true;
    }
  }

  accionMenu() {
    if (!this.bandMenu) {
      $('.chiller-theme').addClass('toggled');
      this.bandMenu = true;
    } else {
      $('.chiller-theme').removeClass('toggled');
      this.bandMenu = false;
    }
  }

  abrirOpcion(clase: string) {
    $('.sidebar-submenu').slideUp(200);
    if ($('.sidebar-dropdown > a').parent().hasClass('active')) {
      $('.sidebar-dropdown').removeClass('active');
      $('.' + clase)
        .parent()
        .removeClass('active');
    } else {
      $('.sidebar-dropdown').removeClass('active');
      $('.' + clase)
        .next('.sidebar-submenu')
        .slideDown(200);
      $('.' + clase)
        .parent()
        .addClass('active');
    }
  }

  logOut() {
    Notiflix.Confirm.show(
      'Estás a punto de cerrar sesión',
      '¿Estás seguro?',
      'Si',
      'No',
      () => {
        localStorage.removeItem('token');
        location.reload();
      },
      () => {},
      {
        backOverlay: true,
        backOverlayColor: 'rgba(0,0,0,0.8)',
        titleColor: '#f34e4e',
        okButtonBackground: '#32c682',
        cancelButtonBackground: '#f34e4e',
      }
    );
  }
}
