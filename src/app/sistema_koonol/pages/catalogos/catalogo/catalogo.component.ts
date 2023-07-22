import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@data/services/auth/auth.service';
import { Product } from 'src/app/models/products.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { Articulo } from 'src/app/models/articulo.model';
import { FamiliasService } from 'src/app/services/familias/familias.service';
import { Familia } from 'src/app/models/familias.model';
import Swal from 'sweetalert2';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
	selector: 'app-catalogo',
	templateUrl: './catalogo.component.html',
	styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {


	//referencia para el modal
	@ViewChild('modalProducto') modalProducto: ElementRef | undefined;
	// Para el Modal
	openModal(item: any) {
		this.selectedCard = item;
		this.isModalOpen = true;
	}

	closeModal() {
		this.isModalOpen = false;
	}

	//MODAL
	inicoSlide: number = 0;
	abrirModalConImagenes(articulo: any) {
		this.selectedCard = articulo;
		this.isModalOpen = true;
		this.inicoSlide = 0;
	}
	siguienteSlide() {
		this.inicoSlide = (this.inicoSlide + 1) % this.selectedCard?.imagenes.length;
	}

	anteriorSlide() {
		this.inicoSlide = (this.inicoSlide - 1 + this.selectedCard?.imagenes.length) % this.selectedCard?.imagenes.length;
	}



	clickFuera(event: MouseEvent) {
		const cosito = event.target as HTMLElement;
		const modalcin = document.querySelector('.modal-content') as HTMLElement;

		if (!modalcin.contains(cosito)) {
			this.closeModal();
		} else {
			event.stopPropagation();
		}

	}







	//Variable para almacenar los productos del pedido para el carrito
	pedido: Articulo[] = [];

	constructor(
		private router: Router,
		private catalogo: CatalogoService,
		private familias: FamiliasService
	) {
	}

	ngOnInit() {
		this.catalogo.getPedido()
		this.cargarArticulos();
		this.allItems = [...this.items];
		this.catalogo.pedido$.subscribe(pedido => this.pedido = pedido)
	}

	articulos: Articulo[] = [];
	articulo: Articulo = new Articulo(0, 0, 0, '', '', '', 0, 0, 0, 0, 0, 0, '', true, 0, [], 0, 0, '');

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
		this.catalogo.obtenerArticulos().subscribe(resp => {
			if (resp.ok) {
				this.articulos = resp.data
				this.familias.obtenerFamilias().subscribe(resp => {
					let familias = resp.data
					this.familiasActivas = familias.filter((familia: Familia) => familia.activo == 1)
					this.itemsFiltrados()
					console.log(this.filteredItems);
				})
			} else {
				Swal.fire('Ocurrio un error', resp.message, 'error')
				console.log('==>>');
			}
		})
	}

	//Función para añadir un producto al carrito de pedido
	agregarProductoCarrito(item: Articulo) {
		const productoExistente = this.pedido.find(product => product.id_existencia === item.id_existencia);
		if (productoExistente) {
			productoExistente.quantity++
		} else {
			item.quantity = 1
			this.pedido.push(item)
		}
		this.catalogo.updatePedido(this.pedido)
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


	//Para editar articulos
	editarArt(id_articulo: any) {
		this.router.navigate(['/sis_koonol/catalogos/add-product', id_articulo]);
	}


	//Para el boton .
	addProducto() {
		this.router.navigate(['/sis_koonol/catalogos/add-product']);
	}

  modalVisibility = false;

  toggleModalVisibility() {
    this.modalVisibility = !this.modalVisibility;
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

}
