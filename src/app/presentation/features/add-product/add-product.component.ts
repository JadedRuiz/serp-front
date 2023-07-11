import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { DataUrl, NgxImageCompressService, UploadResponse,} from 'ngx-image-compress';
import { Product } from 'src/app/models/products.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { NgForm } from '@angular/forms';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { Familia } from 'src/app/models/familias.model';
import { AlmacenService } from 'src/app/services/almacenes/almacen.service';
import { Almacen } from 'src/app/models/almacen.model';
import { MedidaService } from'src/app/services/medidas/medida.service';
import { Medida } from 'src/app/models/medidas.model';
import { Foto } from 'src/app/models/fotografias.model';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})


export class AddProductComponent {

  imgResultAfterResize: string = '';
  uploadedImages: string[] = [];
  imageCount: number = 0;
  precioMasIva : number = 0;


  constructor(
    private router: Router,
    private imageCompress: NgxImageCompressService,
    private productService: CatalogoService,
    private familiaService: FamiliaService,
    private almacenService: AlmacenService,
    private medidaService: MedidaService) {}

    ngOnInit() {
      this.obtenerFamilias()
      this.obtenerAlmacenes()
      this.obtenermedidas()
    }

  items: Product[] = [];
  //  Lista de elementos
  foto: Foto = new Foto('')
  fotos: Foto[] = [this.foto]
  item: Product = new Product(
    0,
    1,
    '',
    '',
    0,
    0,
    0,
    1,
    0,
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




//para familias
  familias: Familia[] = []
obtenerFamilias(){
  this.familiaService.obtenerFamilias().subscribe((objeto) => {
    this.familias = objeto.data;
})
}

//para Unidad de medida
medidas : Medida [] = []
obtenermedidas(){
this.medidaService.obtenerMedidas().subscribe((objeto)=>{
  this.medidas = objeto.data;
})
}

//para Almacen
almacenes : Almacen [] = []

obtenerAlmacenes(){
  let json = {
    id_almacen: 0,
    id_comprador: 1,
    almacen: '',
    solo_activos: 1,
    token: '012354SDSDS01',
  };
  this.almacenService.obtenerAlmacenes(json).subscribe((objeto) => {
    this.almacenes = objeto.data;
})
}

//Para Productos
guardarArticulo(productForm: NgForm){
  console.log(productForm.value);
  this.productService.obtenerArticulos();
    this.productService.agregarProducto(this.item).subscribe((objeto) => {
      //console.log('guardar Art',objeto);
      this.guardarFotos();
    });
}

//Calcular Iva y aplicar descuentos
calcularPrecioMasIva(){
const precioVenta = this.item.precio_venta;
const descuento1 = this.item.descuento1;
const descuento2 = this.item.descuento2;
const descuento3 = this.item.descuento3;
const tasaIVA = this.item.tasa_iva;

//aplica el descuento
const precioDescuento1 = precioVenta - (precioVenta * descuento1 / 100);
const precioDescuento2 = precioDescuento1 - (precioDescuento1 * descuento2 / 100);
const precioDescuento3 = precioDescuento2 - (precioDescuento2 * descuento3 / 100);

const resultado = (precioDescuento3 * (1 + tasaIVA / 100)).toFixed(2);
  this.precioMasIva = Number(resultado);
}




  //PARA LAS IMAGENES =>
uploadAndResize() {
  if (this.imageCount >= 5) {
    alert('Solo se pueden subir un máximo de 5 imágenes');
    return;
  }

  return this.imageCompress.uploadFile().then(({ image, orientation }: UploadResponse) => {
    console.warn('Tamaño Inicial:', this.imageCompress.byteCount(image));

    if (this.imageCompress.byteCount(image) > 5 * 1024 * 1024) {
      alert('El tamaño de la imagen excede el límite de 5 MB');
      return;
    }

    console.warn('comprimida y redimensionada a 400x');
    this.imageCompress
      .compressFile(image, orientation, 40, 40, 400, 400)
      .then((result: DataUrl) => {
        let image = result.slice(22)
        console.log('image',image);
        this.uploadedImages.push(image);
        this.imageCount++;
        console.warn('FINAL:', this.imageCompress.byteCount(result));

        this.displayImage(this.uploadedImages.length - 1);

      });
  });
}


  displayImage(index: number){
    this.imgResultAfterResize  = this.uploadedImages[index];
  }




  //Guardar Fotos
  guardarFotos(){
    const fotos = this.uploadedImages.map((image)=>{
      console.log('Ws=>',image);
      return {
        base64: image,
      };
    });
    this.productService.guardarFotos(fotos).subscribe(
      (resp)=>{
        console.log('Guardadas',resp);
      },
      (error)=>{
        console.log('G',fotos);
        console.log('Error',error);
      }
    )
  }


}
