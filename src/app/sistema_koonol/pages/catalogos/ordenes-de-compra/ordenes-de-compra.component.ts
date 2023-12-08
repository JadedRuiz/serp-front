import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject, } from '@angular/core';
import { FormControl, ReactiveFormsModule, NgForm,FormGroup, Validators, FormBuilder } from '@angular/forms';
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
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MonedaService } from 'src/app/services/monedas/moneda.service';
import { Moneda } from 'src/app/models/moneda.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


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
  token = 'VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0='

  //service de moneda injectado
private monedaService = inject(MonedaService)


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
 @ViewChild('cancelModal') cancelModal: ElementRef | undefined;

  articuloCompuesto = ''
  total: number = 0;
  fechaActual=new Date();
  tipoCambio=0;
  modal: BsModalRef = {} as BsModalRef;
  idCompra:any=0;

 constructor(

  private proveedor_service : ProveedoresService,
  private datePipe: DatePipe,
  private productService: CatalogoService,
  private ordeneService: OrdenesService,
  private modalService: BsModalService,
  private fb: FormBuilder,
  private route: ActivatedRoute,
  private router : Router
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
 this.obtenerProveedor();
 this.obtenerProductos2();
 this.getMonedas();
 this.values();
}


// DATOS DE MUESTRA
transactions: Transaction[] = [];

//VALORES POR DEFECTO
values(){
this.ordenCompra.forma_pago = 'CONTADO';
this.route.params.subscribe(p =>{
  const id = +p['id'];
  if(id){
    this.idCompra = this.asignarOrden(id);
  }
})

}

//EDITAR ORDEN DE COMPRA
folio:any='';
asignarOrden(id:number){
  let json = {
    id_compra : id,
    token: this.token,
    id_usuario : this.dataLogin.id_usuario
  }
  this.ordeneService.buscarCompraID(json).subscribe(resp =>{
    if(resp.ok){
      const orden = resp.data[0];
      const articulos = orden.articulos;
      this.folio = orden.folio;
      this.ordenCompra = resp.data[0];
      this.fechaActual = orden.fecha;
      this.provCtrl = new FormControl(orden.proveedor);
      for (const art of articulos){
        try {
          const tran = {
                producto: art.articulo,
                cantidad: Number(art.cantidad),
                pUnitario: Number(art.precio_unitario),
                importe: Number(art.cantidad * art.precio_unitario),
                id_existencia: Number(art.id_existencia),
                id_det_compra: Number(art.id_det_compra),
                descuento_1:Number(art.descuento_1),
                descuento_2:Number(art.descuento_2),
                descuento_3:Number(art.descuento_3),
                ieps:Number(art.ieps),
                tasa_iva:Number(art.tasa_iva)
          };
          this.transactions = this.transactions.slice();
          this.transactions.push(tran)
        }catch (error){
          console.log('error :>> ', error);
        }
      }
      console.log('resp.data :>> ', this.transactions);
      console.log('resp.data :>> ', articulos);
    }
  })
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
  this.articuloCompuesto = pro.option.id.articulo_compuesto
}

//MONEDAS
monedas:Moneda[]=[];
monDef=100

//Traer monedas ->
getMonedas(){
  const json = {
    id_moneda : 0,
    moneda: '',
    token: this.dataLogin.token
  }
  this.monedaService.getMonedas(json).subscribe({
    next: (mon)=>{
      this.monedas = mon.data;
    },
    error: (err)=>{
      Swal.fire({
        icon: 'error',
      })
    }
  })

}

monedaSelec(event: any) {
  const monSelect = this.monedas.find(mon=> event.target.value === mon.id_moneda)
  this.ordenCompra.id_moneda = Number(monSelect!.id_moneda);
  //  console.log('Selected Moneda:', monSelect);
}


//NUEVOS CAMPOS DE ORDEN
descProveedor = 'Desc(proveedor)';
medidaProveedor = 'U.Medida(proveedor)';


//AGREGAR ARTICULO A LA TABLA
agregarProducto() {
if(this.articuloCompuesto && this.productoProveedor.cantidad > 0) {
  let nuevoProducto = {
    producto: this.articuloCompuesto,
    cantidad: this.productoProveedor.cantidad,
    pUnitario: this.productoProveedor.precio_unitario,
    // importe: this.productoProveedor.cantidad * this.productoProveedor.precio_unitario,
    importe: this.total,
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
  Swal.fire({
    title: 'Articulo agregado correctamente',
    timer: 1000,
    icon: 'success'
  })
  this.productoProveedor = new ProductProv(0,0,0,0,0,0,0,0,0);
  this.productCtrl.setValue('');
  this.cancelModal?.nativeElement.click();

}if(!this.articuloCompuesto){
  Swal.fire({
    title: 'Seleccione un producto',
    timer: 2000,
    icon: 'info'
  })
}

}


// CALCULAR TOTAL
recalcularTotal() {
  // Lógica para recalcular el total
  let cantidad = this.productoProveedor.cantidad;
  let pUnitario = this.productoProveedor.precio_unitario;
  this.total = cantidad * pUnitario;

  // Descuentos
  if (this.productoProveedor.descuento_1) {
    this.total = this.total - (this.total * (this.productoProveedor.descuento_1 / 100));
  }
  if (this.productoProveedor.descuento_2) {
    this.total = this.total - (this.total * (this.productoProveedor.descuento_2 / 100));
  }
  if (this.productoProveedor.descuento_3) {
    this.total = this.total - (this.total * (this.productoProveedor.descuento_3 / 100));
  }

  // IEPS
   let iemps:number=0

  if (this.productoProveedor.ieps) {
    iemps = (this.total * (this.productoProveedor.ieps / 100));
  }

  // Tasa de IVA
  let iva = 0;
  if (this.productoProveedor.tasa_iva) {
    iva = (this.total + iemps ) * (this.productoProveedor.tasa_iva/100);
  }

  //  sumar IEPS y tasa de IVA al total final
  this.total = this.total + iemps + iva;

}





productoEdit = ''
// EDITAR UN PRODUCTO
editarItem(row: any) {

  this.editando = true;
  this.productoProveedor = row;
  this.productoEdit = row.producto
 this.productoProveedor.precio_unitario =  row.pUnitario;
 this.articuloCompuesto = row.producto;
 this.recalcularTotal();
  console.log('transaction :>> ', row.pUnitario);
  console.log('transaction :>> ', this.productoProveedor);
  console.log('transaction :>> ', this.articuloCompuesto);
}

guardarEdit(){
  Swal.fire({
    title: "¿Actualizar producto?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí"
  }).then((result) => {
    if (result.isConfirmed){
      let indice = this.transactions.findIndex(transaction => transaction.id_existencia === this.productoProveedor.id_existencia)
      // console.log('indice :>> ', indice);
      if(indice !==-1){
      this.transactions = this.transactions.slice();
        this.transactions[indice] = {
          producto: this.productoEdit,
          cantidad: this.productoProveedor.cantidad,
          pUnitario: this.productoProveedor.precio_unitario,
          importe: this.productoProveedor.cantidad * this.productoProveedor.precio_unitario,
          id_existencia: this.productoProveedor.id_existencia,
          id_det_compra:this.productoProveedor.id_det_compra,
          descuento_1:this.productoProveedor.descuento_1,
          descuento_2:this.productoProveedor.descuento_2,
          descuento_3:this.productoProveedor.descuento_3,
          ieps:this.productoProveedor.ieps,
          tasa_iva:this.productoProveedor.tasa_iva,
        }
        console.log('this.tra :>> ', this.transactions);
        this.productoProveedor.precio_unitario = this.transactions[indice].pUnitario
        this.cancelModal?.nativeElement.click();
      }
    }
  });

}

cancelarEdit(){
  this.editando = false;
  this.productoProveedor = new ProductProv(0,0,0,0,0,0,0,0,0);
  this.total = 0

}


// BORRAR UN PRODUCTO DE LA LISTA
detallesID:number[] = [];
borrarItem(transaction: any) {
  console.log('trasnsaction :>> ', transaction);
  Swal.fire({
    title: "¿Remover articulo de la orden?",
    text: transaction.producto,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí"
  }).then((result) => {
    if (result.isConfirmed) {
      //agregamos el id al array de detalles
      if(transaction.id_det_compra !== 0){
        this.detallesID.push(transaction.id_det_compra);
      }
      // Encuentra el índice del artículo en el array
      const index = this.transactions.indexOf(transaction);

      if (index !== -1) {
        // Elimina el artículo del array
        this.transactions.splice(index, 1);

        // Crea una nueva referencia al array para que Angular detecte el cambio
        this.transactions = this.transactions.slice();

        // console.log('transaction eliminado: ', transaction);

        Swal.fire({
          title: "Artículo eliminado de la orden de compra",
          icon: "success",
          timer: 1000
        });
      } else {
        console.error('No se pudo encontrar el artículo.');
      }
    }
  });
}


// PARA OBTENER EL TOTAL DE LA TABLA
getTotalCost(): number { return this.transactions.reduce((total, transaction) => total + transaction.importe, 0); }

//PARA LOS IMPUESTOS DE LA TABLA
 getImpuestos(): number {
  return this.transactions.reduce((totalTaxes, transaction) => {
    const iva = transaction.tasa_iva /100
    const impuesto = transaction.importe * iva
    return totalTaxes + impuesto;
  }, 0);
}

//PARA LOS DESCUENTOS
getDescuentos(){
  return this.transactions.reduce((totalAhorro, transaction) => {
    const porcentajeDescuento = (transaction.descuento_1 + transaction.descuento_2 + transaction.descuento_3) / 100;
    const montoAhorro = transaction.importe * porcentajeDescuento;
    return totalAhorro + montoAhorro;
  }, 0);
}

//PARA LOS IMPORTES
getImporte(){
  return this.transactions.reduce((totalImporte, transaction) =>{
    const importe = transaction.cantidad * transaction.pUnitario
    return totalImporte + importe
  },0);
}

//PARA LAS BONIFICACIONES
getDevoliciones(){
  const dev = 0.00
  return dev
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
    id_almacen: Number(this.dataLogin.almacenes[0].id_almacen),
    id_proveedor: Number(this.ordenCompra.id_proveedor),
    folio:this.folio,
    id_moneda:  this.ordenCompra.id_moneda || this.monDef,
    token: this.token,
    forma_pago: this.ordenCompra.forma_pago,
    dias_credito: this.ordenCompra.dias_credito,
    tipo_cambio: this.ordenCompra.tipo_cambio,
    fecha_entrega: this.ordenCompra.fecha_entrega,
    observaciones: this.ordenCompra.observaciones,
    id_usuario: this.dataLogin.id_usuario,
    articulos: [],
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
      this.eliminarDetalle();
      Swal.fire({
        title: "Orden de compra confirmada",
        text: resp.data.mensaje,
        icon: "success"
      });
      this.vaciarOrden();
    }if (resp.ok == false){
      Swal.fire('error',resp.message,'error');
    }
  })

  if(this.ordenCompra.id_compra !==0){
    this.router.navigate(['/sis_koonol/catalogos/ordenescompra'])
  }

  // Lógica adicional para guardar la orden de compra con los datos creados
  console.log('JSON ENVIADO: ', nuevaOrden);
}

// ELIMINAMOS EL DETALLE DE LA ORDEN
eliminarDetalle(){
if(this.detallesID.length > 0){
  this.detallesID.forEach(id => {
    let json = {
      id_det_compra: id,
      token: this.token,
      id_usuario: this.dataLogin.id_usuario
    }
    this.ordeneService.eliminarDetalle(json).subscribe((resp)=>{
      if(resp.ok){

      }
    })
  });




}
}

//IMPRIMIR
printOrden(){
  Swal.fire({
    title: "¿Imprimir orden de compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: 'Regresar',
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Enviando orden de compra",
        icon: "success",
        timer: 2000
      });
    }
  });
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
      if(this.ordenCompra.id_compra !==0){
        this.router.navigate(['/sis_koonol/catalogos/ordenes'])
      }
      this.vaciarOrden();
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
   this.transactions=[];
   this.values();
}

}
