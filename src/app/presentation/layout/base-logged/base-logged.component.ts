import { Component } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

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
          animate('1500ms', style({transform: 'translateX(-100%)'}))
        ]),
        transition(':enter', [
          style({transform: 'translateX(-100%)' }),
          animate('1500ms', style({transform: 'translateX(0)'}))
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
      this.column_size = "is-10";
      this.show_menu = false;
    }else{
      this.column_size = "is-12";
      this.show_menu = true;
    }
    
  } 

  
}
