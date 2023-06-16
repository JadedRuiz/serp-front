import { Component  } from '@angular/core';
import {
  DataUrl,
   NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})

export class AddProductComponent {

  imgResultBeforeCompress: DataUrl = '';
  imgResultAfterCompress: DataUrl = '';
  imgResultAfterResize: DataUrl = '';
  imgResultUpload: DataUrl = '';
  imgResultAfterResizeMax: DataUrl = '';

  constructor(private imageCompress: NgxImageCompressService) {}

  uploadAndResize() {
    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        console.warn('Tamaño Inicial:', this.imageCompress.byteCount(image));
        console.warn('comprimida y re dimencionada a 400x');

        this.imageCompress
          .compressFile(image, orientation, 50, 50, 400, 400)
          .then((result: DataUrl) => {
            this.imgResultAfterResize = result;
            
            console.warn(
              'FINAL:',
              this.imageCompress.byteCount(result)
            );
          
          });
      });
  }
  

}


