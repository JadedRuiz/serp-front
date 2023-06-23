import { Component } from '@angular/core';
import { DataUrl, NgxImageCompressService, UploadResponse,} from 'ngx-image-compress';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})


export class AddProductComponent {


  imgResultAfterResize: DataUrl = '';
  uploadedImages: string[] = [];
  imageCount: number = 0;



  constructor(private imageCompress: NgxImageCompressService) {}

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
