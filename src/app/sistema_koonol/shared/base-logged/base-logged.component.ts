import { map } from 'rxjs/operators';
import { Perfil } from 'src/app/models/perfil.model';
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
import { Location } from '@angular/common';
import * as Notiflix from 'notiflix';
import * as $ from 'jquery';
import { Router } from '@angular/router';

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
export class BaseLoggedComponent implements OnInit {
  //#region [Variables globales]
  dataLogin = JSON.parse(localStorage.getItem("dataLogin")+"");
  column_size = 'is-10';
  show_menu = true;
  bandMenu = true;
  id_usuario = this.dataLogin.id_usuario;
  img_user = this.dataLogin.foto != "" ? this.dataLogin.foto : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  menu : any;
  //#endregion

  constructor(private location: Location,
    private router : Router) { }

  clickFueraHabilitado: boolean = false;
  pantallaChica: boolean = false;
  tamañoPantalla: number = window.screen.width;
  ngOnInit() {
    this.cargaMenu();
    if (this.tamañoPantalla < 768) {
      this.pantallaChica = true;
      $('.chiller-theme').removeClass('toggled');
      this.bandMenu = false;
      this.clickFueraHabilitado = true;
    }
    this.habilitarClickFuera()

  }

  cargaMenu(){
    this.menu = [];
    this.dataLogin.permisos.forEach((element : any) => {
      if(element.estitulo == 1){
        element.hijos = [];
        this.menu.push(element);
      }
    });
    this.dataLogin.permisos.forEach((element : any) => {
      this.menu.forEach((menu : any) => {
        if(menu.clave.substring(-4,3) == element.clave.substring(-4,3)){
          menu.hijos.push(element);
        }
      });
    });
    console.log(this.menu);
  }

  clickFuera(event: MouseEvent) {
    const cosito = event.target as HTMLElement;
    const hamburguesa = document.querySelector(
      '.sidebar-wrapper'
    ) as HTMLElement;

    // if (!hamburguesa.contains(cosito) && this.bandMenu == true) {
    $('.chiller-theme').removeClass('toggled');
    this.bandMenu = false;
    // } else {
    //   event.stopPropagation();
    // }
  }

  habilitarClickFuera() {
    if (this.location.path() == '/sis_koonol/catalogos/bitacora-visitas' && !this.pantallaChica) {
      this.clickFueraHabilitado = true
      $('.chiller-theme').removeClass('toggled');
      this.bandMenu = false;
    } else if(!this.pantallaChica){
      this.clickFueraHabilitado = false
    }
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
        localStorage.removeItem('dataLogin');
        this.router.navigate(["/"]);
      },
      () => { },
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
