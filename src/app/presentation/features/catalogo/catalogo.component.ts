import { Component,HostListener  } from '@angular/core';




@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent {

  //  Lista de elementos 
  items = [
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Platanos',
      fam: 'Frutas',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$14..00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Panela',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$17.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Leche',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$16.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Pera',
      fam: 'Frutas',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$14.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Bola',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$17.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Entera',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$16.00'
    },
        
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Bola',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$17.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Entera',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$16.00'
    },
        
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Bola',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$17.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Entera',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$16.00'
    },
        
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Bola',
      fam: 'Quesos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$17.00'
    },
    {
      imageUrl: '../../../../assets/imgCat/fruts.jpeg',
      title: 'Entera',
      fam: 'Lacteos',
      description: 'Los platanos son rosas y esta sera una descripcion',
      price: '$16.00'
    },
        
  ]



  allItems: any[] = [];

  isModalOpen = false;
  selectedCard: any;
  searchTitle: string = '';
  searchFam: string = '';
  noResults: boolean = false;
  
  
  // Realizar una copia de los elementos completos
  ngOnInit() {
  this.allItems = [...this.items];
  }


    // Filtra los elementos del catálogo 
   buscar() {
    this.items = this.allItems.filter(item =>
      item.title.includes(this.searchTitle) && item.fam.includes(this.searchFam)
    );
    this.noResults = this.items.length === 0;
  }

    // Restaura los elementos completos desde la copia
  resetCatalogo() {
    this.items = [...this.allItems];
    this.noResults = false;
  }


  // Para el Modal
  openModal(item: any) {
    this.selectedCard = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  // Para la barra de busqueda
isSticky: boolean = false;

@HostListener('window:scroll', ['$event'])
checkScroll() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  if (scrollPosition > 0) {
    this.isSticky = true;
  } else {
    this.isSticky = false;
  }
}
}
