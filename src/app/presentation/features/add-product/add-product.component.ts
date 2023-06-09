import { Component  } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent {


  constructor(private router: Router) {}

  nombreProducto: string = '';
  familiaProducto: string = '';
  descripcionProducto: string = '';
  precioProducto: number = 0;
  imagenProducto: File | null = null;

  agregarProducto() {

    // Creando el objeto
    const nuevoProducto = {
      nombre: this.nombreProducto,
      familia: this.familiaProducto,
      descripcion: this.descripcionProducto,
      precio: this.precioProducto,
      imagen: this.imagenProducto
    };

    // BD??

    // Reiniciar los valores del formulario
    this.nombreProducto = '';
    this.familiaProducto = '';
    this.descripcionProducto = '';
    this.precioProducto = 0;
    this.imagenProducto = null;
  }



  //Para visualizar la imagen =>
 
  selectedImage: string | ArrayBuffer | null = null;
  

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

atras() {
  this.router.navigate(['./catalogo']);
}


}
