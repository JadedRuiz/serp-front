import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-carousel-header',
  templateUrl: './carousel-header.component.html',
  styleUrls: ['./carousel-header.component.scss']
})
export class CarouselHeaderComponent implements OnInit {
  Imagedata:any=''
  constructor() { }

  ngOnInit(): void {
this.cargaInicial()
  }

  cargaInicial(){
    this.recuperarImagenes();
  }


  recuperarImagenes(){
    this.Imagedata = [
      `https://apiliga.serteza.com/storage/carousel/sidebar-1.jpg`,
      `https://apiliga.serteza.com/storage/carousel/sidebar-2.jpg`,
      `https://apiliga.serteza.com/storage/carousel/sidebar-3.jpg`,
    ];
  }


}
