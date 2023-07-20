import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DataUrl,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';
import { Product } from 'src/app/models/products.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { NgForm } from '@angular/forms';
import { FamiliaService } from '@data/services/sfamilia/familia.service';
import { Familia } from 'src/app/models/familias.model';
import { AlmacenService } from 'src/app/services/almacenes/almacen.service';
import { Almacen } from 'src/app/models/almacen.model';
import { MedidaService } from 'src/app/services/medidas/medida.service';
import { Medida } from 'src/app/models/medidas.model';
import { Foto } from 'src/app/models/fotografias.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  producto: Product | undefined;

  imgResultAfterResize: any = '';
  uploadedImages: any[] = [];
  imageCount: number = 0;
  precioMasIva: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private imageCompress: NgxImageCompressService,
    private productService: CatalogoService,
    private familiaService: FamiliaService,
    private almacenService: AlmacenService,
    private medidaService: MedidaService
  ) {}

  ngOnInit() {
    console.log(this.item.activo);
    //Editar
    const idArticulo = this.route.snapshot.params['id'];
    if (idArticulo) {
      this.productService
        .obtenerArticuloId(idArticulo)
        .subscribe((producto) => {
          //this.item = producto.data[0]
          console.log(idArticulo);

          producto = producto.data[0];
          // Asignando los valores al form
          this.item = new Product(
            producto.id_articulo,
            (producto.id_comprador = 1),
            '012354SDSDS01',
            producto.articulo,
            producto.id_almacen,
            producto.id_medida,
            producto.id_familia,
            (producto.id_prodserv_sat = 1),
            producto.tasa_iva,
            producto.codigo_barras,
            producto.activo,
            producto.id_usuario,
            producto.id_existencia,
            producto.precio_venta,
            producto.descuento1,
            producto.descuento2,
            producto.descuento3,
            producto.minimo,
            producto.maximo,
            producto.reorden,
            producto.peso_producto,
            producto.imagenes
          );
          this.uploadedImages = producto.imagenes;
          console.log(this.uploadedImages);
          this.calcularPrecioMasIva();
          // console.log(producto);
          // console.log(this.item);
          // console.log(this.fotos);
          this.imgResultAfterResize = this.uploadedImages[0].fotografia;
        });
    }

    this.obtenerFamilias();
    this.obtenerAlmacenes();
    this.obtenermedidas();
  }

  //  Lista de elementos
  foto: Foto = new Foto('');
  fotos: Foto[] = [this.foto];
  items: Product[] = [];
  item: Product = new Product(
    0,
    1,
    '012354SDSDS01',
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
  familias: Familia[] = [];
  obtenerFamilias() {
    this.familiaService.obtenerFamilias().subscribe((objeto) => {
      this.familias = objeto.data;
    });
  }

  //para Unidad de medida
  medidas: Medida[] = [];
  obtenermedidas() {
    this.medidaService.obtenerMedidas().subscribe((objeto) => {
      this.medidas = objeto.data;
    });
  }

  //para Almacen
  almacenes: Almacen[] = [];

  obtenerAlmacenes() {
    let json = {
      id_almacen: 0,
      id_comprador: 1,
      almacen: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.almacenService.obtenerAlmacenes(json).subscribe((objeto) => {
      this.almacenes = objeto.data;
    });
  }

  //Para  guardar Productos
  guardarArticulo(productForm: NgForm) {
    this.productService.agregarProducto(this.item).subscribe((objeto) => {
      console.log('=>>', objeto.id_articulo);
      this.guardarFotos(objeto.id_articulo);
    });
    this.productService.obtenerArticulos();
  }

  //Calcular Iva y aplicar descuentos
  calcularPrecioMasIva() {
    const precioVenta = this.item.precio_venta;
    const descuento1 = this.item.descuento1;
    const descuento2 = this.item.descuento2;
    const descuento3 = this.item.descuento3;
    const tasaIVA = this.item.tasa_iva;

    //aplica el descuento
    const precioDescuento1 = precioVenta - (precioVenta * descuento1) / 100;
    const precioDescuento2 =
      precioDescuento1 - (precioDescuento1 * descuento2) / 100;
    const precioDescuento3 =
      precioDescuento2 - (precioDescuento2 * descuento3) / 100;

    const resultado = (precioDescuento3 * (1 + tasaIVA / 100)).toFixed(2);
    this.precioMasIva = Number(resultado);
    console.log();
  }

  //PARA LAS IMAGENES =>
  uploadAndResize() {
    if (this.imageCount >= 4) {
      alert('Solo se pueden subir un máximo de 4 imágenes');
      return;
    }

    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        //console.warn('Tamaño Inicial:', this.imageCompress.byteCount(image));

        if (this.imageCompress.byteCount(image) > 5 * 1024 * 1024) {
          alert('El tamaño de la imagen excede el límite de 5 MB');
          return;
        }

        //    console.warn('comprimida y redimensionada a 400x');
        this.imageCompress
          .compressFile(image, orientation, 40, 40, 400, 400)
          .then((result: DataUrl) => {
            //let image = result.slice(22)
            console.log('image', image);
            this.uploadedImages.push(image);
            this.imageCount++;
            console.warn('FINAL:', this.imageCompress.byteCount(result));
            console.log(this.uploadedImages);
            this.displayImage(this.uploadedImages.length - 1);
          });
      });
  }

  guardarFoto() {}

  displayImage(index: number) {
    this.imgResultAfterResize = this.uploadedImages[index];
    console.log(this.imgResultAfterResize);
    console.log(this.uploadedImages);
  }

  //Guardar Fotos
  guardarFotos(id_articulo: any) {
    let imagenes = this.uploadedImages.filter((image) => {
      if (image.fotografia) {
        return;
      } else {
        return image.includes('data:image/jpeg;base64');
      }
    });
    this.productService.guardarFotos(id_articulo, imagenes).subscribe(
      (resp) => {
        console.log('Guardadas', resp);
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }
  removeImage(index: number) {
    if (index === 0) {
      this.imgResultAfterResize = '';
    } else {
      this.uploadedImages.splice(index - 1, 1);
    }
    this.imageCount--;
  }
}
