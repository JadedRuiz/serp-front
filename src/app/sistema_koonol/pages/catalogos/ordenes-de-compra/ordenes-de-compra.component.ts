import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra.model';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { Address } from 'src/app/models/addresses.model';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { Articulo } from 'src/app/models/articulo.model';
import { OrdenesService } from 'src/app/services/compra/ordenes.service';
import { ProductProv } from 'src/app/models/producto-proveedor';
import { MatTableDataSource } from '@angular/material/table';




export interface Transaction {
  producto: string;
  cantidad: number;
  pUnitario: number;
  importe: number;
  id_existencia: number;
  id_det_compra:number;
  descuento_1:number;
  descuento_2:number;
  descuento_3:number;
  ieps:number;
  tasa_iva:number;
}




@Component({
  selector: 'app-ordenes-de-compra',
  templateUrl: './ordenes-de-compra.component.html',
  styleUrls: ['./ordenes-de-compra.component.scss'],
})
export class OrdenesDeCompraComponent implements OnInit {
  //LOCAL
  dataLogin = JSON.parse(localStorage.getItem("dataLogin")+"");
  token = this.dataLogin.token;




 public domicilio: Address = new Address(0, 1, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, [])
 public proveedor: Proveedor = new Proveedor(0, 1, '012354SDSDS01', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);
 public proveedores: Proveedor[] = [];
 public productFiltrados: Observable<any[]>;
 public producto: Articulo = new Articulo(0,0,0,'','','',0,0,0,0,0,0,'',true,0,[],0,0,0,0,'');
 public productoProveedor = new ProductProv(0,0,0,0,0,0,0,0,0);
 public ordenCompra = new OrdenDeCompra(0,0,0,0,'','',0,0,'','',0,[]);
 public provCtrl: FormControl;
 public provFiltrados: Observable<any[]>;
 public productos: Articulo[] = [];
 public productCtrl: FormControl;
 public editando = false;
 displayedColumns = ['producto', 'cantidad', 'pUnitario', 'importe', 'acciones'];
 @ViewChild('data') mytemplateForm : NgForm | undefined;
  articuloCompuesto = ''
  total: number = 0;
  fechaActual=new Date();
  tipoCambio=0;
  modal:boolean = false;

 constructor(

  private proveedor_service : ProveedoresService,
  private datePipe: DatePipe,
  private productService: CatalogoService,
  private ordeneService: OrdenesService
) {
  this.provCtrl = new FormControl();
  this.provFiltrados = this.provCtrl.valueChanges
    .pipe(
      startWith(''),
      map(prov => prov ? this.filtrarProv(prov) : this.proveedores.slice())
    );

  this.productCtrl = new FormControl();
  this.productFiltrados = this.productCtrl.valueChanges
    .pipe(
      startWith(''),
      map(product => product ? this.filtrarProduct(product) : this.productos.slice())
    );
}


ngOnInit(): void {

  // console.log('data>',this.dataLogin);
  this.values();
 this.obtenerProveedor();
 this.obtenerProductos2();
 this.values();
}


//VALORES POR DEFECTO
values(){
// this.fechaActual= new Date().toISOString();
console.log('this.fechaActual :>> ', this.fechaActual);
this.ordenCompra.forma_pago = 'CONTADO';
this.tipoCambio = this.monedas[0].cambio;
this.modal = true;
}



// AUTO PROVEEDORES
obtenerProveedor() {
  let json = {
    id_proveeedor: 0,
    id_comprador: 1,
    proveedor: '',
    solo_activos: 1,
    token: '012354SDSDS01',
  };

  this.proveedor_service.obtenerProveedores(json).subscribe(
    (resp) => {
      if (resp.ok) {
        this.proveedores = resp.data
        console.log('resp :>> ', this.proveedores);
      }
    },
    (error) => {
      console.log('Error de conexión', error);
    }
  );
}
filtrarProv(name: any) {
  return this.proveedores.filter(prov =>
     prov.proveedor.toUpperCase().indexOf(name.toUpperCase()) === 0);
}
// PROV SELECCINADO
provSelec(prov: any) {
 this.ordenCompra.id_proveedor = prov.option.id.id_proveedor;
//  console.log('prov :>> ', prov.option.id);
}


//AUTO PRODUCTOS
obtenerProductos2(){
  let json = {
    id_existencia: 0,
    id_comprador: 1,
    articulo: '',
    token: '012354SDSDS01',
    id_almacen: 1,
  };
  this.productService.obtenerArticulos().subscribe((resp)=>{
    if(resp.ok){
      this.productos = resp.data
      console.log('resp :>> ', this.productos);
    }
  },
  (error) => {
    console.log('Error de conexión', error);
  }
  );
}

filtrarProduct(name:any){
  console.log('resp :>> ', name)
  return this.productos.filter(product =>
    product.articulo.toUpperCase().indexOf(name.toUpperCase()) === 0)
  }
productSelec(pro:any){
  this.productoProveedor.id_existencia = pro.option.id.id_existencia;
  console.log('object :>> ', pro.option.id.articulo_compuesto);
  this.articuloCompuesto = pro.option.id.articulo_compuesto
}

//MONEDAS
monedas = [
  { id_moneda: 100, moneda: 'MXN', desc: 'Peso mexicano', cambio: 10.89},
  { id_moneda: 149, moneda: 'USD', desc: 'Dólar americano', cambio: 17.89},
  { id_moneda: 49, moneda: 'EUR', desc: 'Euro', cambio: 20.0}
]
monedaSelec(event: any) {
  const selectedMonedaId = event.target.value;
  const selectedMoneda = this.monedas.find(moneda => moneda.id_moneda === +selectedMonedaId);
  this.ordenCompra.id_moneda = selectedMoneda!.id_moneda;
  this.ordenCompra.tipo_cambio = selectedMoneda!.cambio;
  this.tipoCambio= selectedMoneda!.cambio;
  // console.log('Selected Moneda:', selectedMoneda);
}


// DATOS DE MUESTRA
transactions: Transaction[] = [];

//AGREGAR ARTICULO A LA TABLA
agregarProducto() {

  // console.log('object :>> ', this.productoProveedor);

  let nuevoProducto = {
    producto: this.articuloCompuesto,
    cantidad: this.productoProveedor.cantidad,
    pUnitario: this.productoProveedor.precio_unitario,
    importe: this.productoProveedor.cantidad * this.productoProveedor.precio_unitario,
    id_existencia: this.productoProveedor.id_existencia,
    id_det_compra: this.productoProveedor.id_det_compra,
    descuento_1:this.productoProveedor.descuento_1,
    descuento_2:this.productoProveedor.descuento_2,
    descuento_3:this.productoProveedor.descuento_3,
    ieps:this.productoProveedor.ieps,
    tasa_iva:this.productoProveedor.tasa_iva
  };
  this.transactions = this.transactions.slice();
  this.transactions.push(nuevoProducto);
 this.productoProveedor = new ProductProv(0,0,0,0,0,0,0,0,0);
  this.modal=false;
  // console.log('this.transactions :>> ', this.transactions);
}



// CALCULAR TOTAL
recalcularTotal() {
  // Lógica para recalcular el total
  let cantidad = this.productoProveedor.cantidad
  let pUnitario = this.productoProveedor.precio_unitario
  this.total =  cantidad * pUnitario
}


// PARA OBTENER EL TOTAL DE LA TABLA
getTotalCost(): number { return this.transactions.reduce((total, transaction) => total + transaction.importe, 0); }


//NUEVO PRODUCTO
agregarItem(){
  // this.producto = new ProductProv('','','',0,0,0);
  this.editando = false;

}

// EDITAR UN PRODUCTO
editarItem(row: any) {
  this.editando = true;
  this.producto = row;
  console.log('transaction :>> ', this.producto);
}



// BORRAR UN PRODUCTO DE LA LISTA
borrarItem(transaction: any) {
  Swal.fire({
    title: "¿Eliminar artículo?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí"
  }).then((result) => {
    if (result.isConfirmed) {
      // Encuentra el índice del artículo en el array
      const index = this.transactions.indexOf(transaction);

      if (index !== -1) {
        // Elimina el artículo del array
        this.transactions.splice(index, 1);

        // Crea una nueva referencia al array para que Angular detecte el cambio
        this.transactions = this.transactions.slice();

        console.log('transaction eliminado: ', transaction);

        Swal.fire({
          title: "Artículo eliminado",
          icon: "success"
        });
      } else {
        console.error('No se pudo encontrar el artículo en el array.');
      }
    }
  });
}


// GUARDAR ORDEN DE COMPRA
guardar(){
    Swal.fire({
    title: "¿Confirmar orden de compra?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Revisar',
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar"
  }).then((result) => {
    if (result.isConfirmed) {
  this.nuevaOrden();
    }
  });
}
nuevaOrden() {
  const nuevaOrden: OrdenDeCompra = {
    id_compra: this.ordenCompra.id_compra,
    id_almacen: this.dataLogin.almacenes[0].id_almacen,
    id_proveedor: this.ordenCompra.id_proveedor,
    id_moneda:  this.ordenCompra.id_moneda || this.monedas[0].id_moneda ,
    token: 'VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0=',
    forma_pago: this.ordenCompra.forma_pago,
    dias_credito: this.ordenCompra.dias_credito,
    tipo_cambio: this.ordenCompra.tipo_cambio || this.monedas[0].cambio,
    fecha_entrega: this.ordenCompra.fecha_entrega,
    observaciones: this.ordenCompra.observaciones,
    id_usuario: this.dataLogin.id_usuario,
    articulos: []
  };

  // Agregar los datos de muestra (transactions) al arreglo de artículos
  this.transactions.forEach(transaction => {
    const nuevoProducto: ProductProv = {
      id_det_compra: transaction.id_det_compra,
      id_existencia: transaction.id_existencia,
      cantidad: transaction.cantidad,
      precio_unitario: transaction.pUnitario,
      descuento_1: transaction.descuento_1,
      descuento_2: transaction.descuento_2,
      descuento_3: transaction.descuento_3,
      ieps: transaction.ieps,
      tasa_iva: transaction.tasa_iva
    };

    // Agregar el nuevo producto al arreglo de artículos
    nuevaOrden.articulos.push(nuevoProducto);
  });

  // Configurar el objeto productoProveedor con los valores deseados
  this.productoProveedor = new ProductProv(0, 0, 0, 0, 0, 0, 0, 0, 0);

  this.ordeneService.guardarCompra(nuevaOrden).subscribe(resp=>{
    if(resp.ok){
      Swal.fire({
        title: "Orden de compra confirmada",
        text: resp.data.mensaje,
        icon: "success"
      });
      console.log('resp :>> ', resp);
    }else{
      Swal.fire('error',resp.data.mensaje,'error');
    }
  })

  // Lógica adicional para guardar la orden de compra con los datos creados
  console.log('Orden de compra a guardar: ', nuevaOrden);
}










// CANCELAR ORDEN DE COMPRA
cancelar(){
  Swal.fire({
    title: "¿Cancelar orden de compra?",
    text: "se borraran todos los datos ingresados...",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Regresar',
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('this.ordenDeCompra :>> ', this.ordenCompra);
      Swal.fire({
        title: "Orden de compra cancelada",
        icon: "success"
      });
    }
  });
}

// VACIAR ORDEN
vaciarOrden(){
  this.ordenCompra = new OrdenDeCompra(0,0,0,0,'','',0,0,'','',0,[]);
  // this.ordenCompra.fecha_creacion = new Date ().toISOString ().substring (0,10);
}

}
