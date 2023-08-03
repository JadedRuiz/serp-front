import { Component, ElementRef, Input, Output, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { Address } from 'src/app/models/addresses.model';
import { Foto } from 'src/app/models/fotografias.model';

@Component({
	selector: 'app-addresses-photos-modal',
	templateUrl: './addresses-photos-modal.component.html',
	styleUrls: ['./addresses-photos-modal.component.scss']
})
export class AddressesPhotosModalComponent implements OnInit {

	selectedCard: Address = new Address(0, 0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, []);
	inicoSlide: number = 0;

	@Input() direccionSeleccionada: Address = new Address(0, 0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, []);
	@Input() modalPhotos: boolean = true;
	@Output() toggleModalPhotos = new EventEmitter();

	ngOnInit() {
		this.selectedCard.fotos = [];
		this.direccionSeleccionada.fotos.forEach((fotoObjeto: Foto) => {
			this.selectedCard.fotos.push(fotoObjeto);
			console.log("fotoObjeto ", fotoObjeto);
		});
		console.log("léeme", this.direccionSeleccionada);
		console.log('this.selectedCard :>> ', this.selectedCard);
	}

	//referencia para el modal
	@ViewChild('modalProducto') modalProducto: ElementRef | undefined;

	// Para el Modal
	useToggleModalVisibility() {
		this.toggleModalPhotos.emit();
	}
	siguienteSlide() {
		this.inicoSlide = (this.inicoSlide + 1) % this.selectedCard?.fotos.length;
	}

	anteriorSlide() {
		this.inicoSlide = (this.inicoSlide - 1 + this.selectedCard?.fotos.length) % this.selectedCard?.fotos.length;
	}

	clickFuera(event: MouseEvent) {
		const cosito = event.target as HTMLElement;
		const modalcin = document.querySelector('.modal-content') as HTMLElement;

		if (!modalcin.contains(cosito)) {
			this.useToggleModalVisibility();
		} else {
			event.stopPropagation();
		}

	}



}
