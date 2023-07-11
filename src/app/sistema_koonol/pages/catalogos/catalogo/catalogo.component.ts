import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@data/services/auth/auth.service';
import { Product } from 'src/app/models/products.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { Articulo } from 'src/app/models/articulo.model';
import { FamiliasService } from 'src/app/services/familias/familias.service';
import { Familia } from 'src/app/models/familias.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent {
  constructor(private router: Router, private catalgoo: CatalogoService, private familias: FamiliasService) { }

  articulos: Articulo[] = [];
  articulo: Articulo = new Articulo(0, 0, '', '', '', 0, 0, 0, 0, 0, 0, '', true, 0,[]);

  //  Lista de elementos
  items: Product[] = [];
  item: Product = new Product(
    0,
    1,
    '',
    '',
    0,
    0,
    0,
    0,
    16,
    '',
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    []
  );

  allItems: any[] = [];

  isModalOpen = false;
  selectedCard: any;
  searchTitle: string = '';
  searchFam: string = '';
  resultsNotFound: boolean = false;
  filteredItems: Articulo[] = [];
  filteredItems2: Articulo[] = [];
  familiasActivas: any[] = []

  ngOnInit() {
    this.cargarArticulos();
    this.allItems = [...this.items];
  }

  // Filtra los elementos del catálogo
  itemsFiltrados() {
    this.filteredItems = this.articulos.filter(articulo => {
      return this.familiasActivas.some(familia => familia.id_familia === articulo.id_familia)
    })
    this.filteredItems2 = this.articulos.filter(articulo => {
      return this.familiasActivas.some(familia => familia.id_familia === articulo.id_familia)
    })
  }

  cargarArticulos() {
    this.catalgoo.obtenerArticulos().subscribe(resp => {
      if (resp.ok) {
        console.log('Ws=>',resp);
        this.articulos = resp.data
        console.log(this.articulos);
        // this.familias.obtenerFamilias().subscribe(resp => {
        //   let familias = resp.data
        //   this.familiasActivas = familias.filter((familia: Familia) => familia.activo == 1)
        //   this.itemsFiltrados()
        // })
      }
    })
  }

  // Filtra los elementos del catálogo
  buscar() {
    if (this.searchTitle === '' && this.searchFam === '') {
      this.itemsFiltrados()
    } else {
      this.filteredItems = this.filteredItems2.filter(articulo =>
        articulo.articulo.toLowerCase().includes(this.searchTitle.toLowerCase())
        && articulo.familia.toLowerCase().includes(this.searchFam.toLowerCase())
      );
      console.log('=>', this.filteredItems);
    } this.noResults()
  }

  noResults() {
    if (this.filteredItems.length === 0) {
      this.resultsNotFound = true;
    } else {
      this.resultsNotFound = false;
    }
  }


  // Restaura los elementos completos desde la copia
  resetCatalogo() {
    this.items = [...this.allItems];
    this.resultsNotFound = false;
  }

  // Para el Modal
  openModal(item: any) {
    this.selectedCard = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  //Para el boton .
  addProducto() {
    this.router.navigate(['./add-product']);
  }

  // Para la barra de busqueda
  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition > 0) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  modalVisibility = false;

  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility;
  }


  // Lógica para conectar los productos del catálogo con el carrito de pedido
  pedido:any = sessionStorage.getItem('carrito') || []

  agregarProductoCarrito(item: any) {
    this.pedido.push(item)
    sessionStorage.setItem('carrito', JSON.stringify(this.pedido))
    console.log(this.pedido);
  }
}
