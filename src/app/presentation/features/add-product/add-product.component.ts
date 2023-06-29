import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { DataUrl, NgxImageCompressService, UploadResponse,} from 'ngx-image-compress';
import { Product } from 'src/app/models/products.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})


export class AddProductComponent {


  imgResultAfterResize: DataUrl = '';
  uploadedImages: string[] = [];
  imageCount: number = 0;



  constructor(
    private router: Router,
    private imageCompress: NgxImageCompressService,
    private productService: CatalogoService) {}

  items: Product[] = [];
  //  Lista de elementos
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
    0
  );



//Para Productos

guardarArticulo(productForm: NgForm){
    this.productService.agregarProducto(this.item).subscribe((objeto) => {
      console.log(objeto);
      this.productService.obtenerPerfiles();
      console.log(productForm.value);
    });
}


  //PARA LAS IMAGENES =>
  uploadAndResize() {
    if (this.imageCount >= 5) {
      alert('Solo se pueden subir 5 imagenes');
      return;
    }

    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {

        console.warn('Tamaño Inicial:', this.imageCompress.byteCount(image));
        console.warn('comprimida y re dimencionada a 400x');

        this.imageCompress
          .compressFile(image, orientation, 30, 30, 300, 300)  //20=15070
          .then((result: DataUrl) => {
            this.uploadedImages.push(result);
            this.imageCount++;

            console.warn('FINAL:', this.imageCompress.byteCount(result));
          });
      });
  }

  displayImage(index: number){
    const selectedImage = this.uploadedImages[index];

    this.imgResultAfterResize = selectedImage;
  }

}
