import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { Subscription, debounceTime } from 'rxjs';
import { ArticuloFinal } from 'src/app/models/articulofinal.model';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { ProveedoresService } from 'src/app/services/proveedores/proveedores.service';
import { Observable, map, startWith } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedores.model';
import { Address } from 'src/app/models/addresses.model';
import { OrdenesService } from 'src/app/services/compra/ordenes.service';
import { OrdenDeCompra } from 'src/app/models/orden-de-compra.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vista-ordenescompra',
  templateUrl: './vista-ordenescompra.component.html',
  styleUrls: ['./vista-ordenescompra.component.scss']
})
export class VistaOrdenescompraComponent {
 public domicilio: Address = new Address(0, 1, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, [])
 public proveedor: Proveedor = new Proveedor(0, 1, '012354SDSDS01', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, this.domicilio);
 public proveedores: Proveedor[] = [];
 public provCtrl: FormControl;
 public provFiltrados: Observable<any[]>;
 fechaInicio = new FormControl('');
 fechaFinal = new FormControl('');
 id_proveedor: number = 0



    modalVisibility: boolean = false
    orderVisibility: boolean = false
    editOrderVisibility: boolean = false
    pedidos: any[] = []
    // articulosPedido: ArticuloFinal[] = []
    articulosPedido:any = []
    pedidoSeleccionado: any;
    dataLogin = JSON.parse(localStorage.getItem('dataLogin')!);
    token = 'VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0='

    constructor(
      private pedidosRealizados: PedidosService,
      private proveedor_service : ProveedoresService,
      private ordenService: OrdenesService,
      private router:Router
    ) {
      this.provCtrl = new FormControl();
  this.provFiltrados = this.provCtrl.valueChanges
    .pipe(
      startWith(''),
      map(prov => prov ? this.filtrarProv(prov) : this.proveedores.slice())
    );
    }

    ngOnInit() {
      this.obtenerOrdenes();
      this.obtenerProveedor();
      // console.log('this.dataLogin :>> ', this.dataLogin);

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
//  console.log('object :>> ', prov.option.id.id_proveedor);
 this.id_proveedor = prov.option.id.id_proveedor;
 this.filtrarOrdenes();
}




//OBTENER ORDENES DE COMPRAS
obtenerOrdenes(){
  let json={
    id_compra: 0,
    id_almacen: Number(this.dataLogin.almacenes[0].id_almacen),
    id_proveedor: 0,
    id_usuario: Number(this.dataLogin.id_usuario),
    fecha_inicial: "",
    fecha_final: "",
    token: "VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0="
  }
  console.log('json :>> ', json);
  this.ordenService.obtenerCompras(json).subscribe((resp)=>{
    if(resp.ok){
      // console.log('resp :>> ', resp);
      this.pedidos = resp.data
    }
  })
}


//FILTRAR ORDENES
filtrarOrdenes(){
  let json = {
    id_compra: 0,
    id_almacen: Number(this.dataLogin.almacenes[0].id_almacen),
    id_proveedor: Number(this.id_proveedor),
    id_usuario: Number(this.dataLogin.id_usuario),
    fecha_inicial: this.fechaInicio.value,
    fecha_final: this.fechaFinal.value,
    token: "VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0="
    //  token: this.dataLogin.token
}
this.ordenService.obtenerCompras(json).subscribe((resp)=>{
  if(resp.ok){
    this.pedidos = resp.data
    this.id_proveedor = 0;
    this.provCtrl.setValue('')
  }else{
    Swal.fire('error',resp.message,'error')
  }
})
}



    i = true;

    seleccionarPedido(id_pedido: number) {
      this.pedidoSeleccionado = this.pedidos.find(pedidos => pedidos.id_compra == id_pedido)
      // console.log(this.pedidoSeleccionado);
      this.buscarPedido(id_pedido)
      this.toggleModalVisibility();
    }

    buscarPedido(id_pedido: number) {
      let json = {
        id_compra : id_pedido,
        token: this.token,
        id_usuario: 1
      }
      this.ordenService.buscarCompraID(json)
      .subscribe(res => {
        if(res.ok){
          const articulos = res.data[0].articulos;
          this.articulosPedido = articulos;
        }
      })
    }

    toggleModalVisibility() {
      this.modalVisibility = !this.modalVisibility
      // this.orderVisibility = !this.orderVisibility
    }

    closeModal() {
      this.modalVisibility = false
      this.orderVisibility = false
      this.editOrderVisibility = false
    }

    openEdit(id:number) {
      Swal.fire({
        title: '¿Editar orden de compra?',
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
        icon:'question',
        confirmButtonColor: '#16a2ff',
      }).then((result) => {
        if (result.isConfirmed) {
            this.router.navigate(['/sis_koonol/catalogos/ordenes',id])
        } else if (result.isDenied) {
        }
      })

    }

    //PARA RE DIRIGIR A NUEVA ORDEN
    redirect(){
      Swal.fire({
        title: '¿Nueva orden de compra?',
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
        icon:'question',
        confirmButtonColor: '#16a2ff',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/sis_koonol/catalogos/ordenes'])
        } else if (result.isDenied) {
        }
      })
    }

    saveEditedOrder() {
      this.editOrderVisibility = false
      this.orderVisibility = true
    }


    cancelarOrden(id:any){
      Swal.fire({
        title: "¿Cancelar Orden de compra?",
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
        icon:'question'
      }).then((result) => {
        if (result.isConfirmed) {
          let json = {
            id_compra: id,
            token: this.token,
            id_usuario: this.dataLogin.id_usuario
          }
          this.ordenService.cancelarCompra(json).subscribe((resp)=>{
            if(resp.ok){
              Swal.fire("¡Hecho!", resp.data.mensaje, "success");
              this.obtenerOrdenes();
              this.toggleModalVisibility();
            }
          })

        } else if (result.isDenied) {
          // Swal.fire("Changes are not saved", "", "info");
        }
      });
    }

    //GENERAR PDF DE COTIZACIÓN
    @ViewChild('cotizacion', { static: false }) cotizacion!: ElementRef
    vistaPdf:boolean=false;

  generarPdfCotizacion() {
    Swal.fire({
      title: '¿Generar PDF?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
      icon: 'question',
      confirmButtonColor: '#16a2ff',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vistaPdf=true;
        html2pdf()
          .set({
            margin: 1,
            filename: `Orden de compra para ${this.pedidoSeleccionado.proveedor}.pdf`,
            html2canvas: {
              scale: 4,
              letterRendering: true
            },
            jsPDF: {
              unit: 'in',
              format: 'a3',
              orientation: 'portrait'
            }
          })
          .from(this.cotizacion.nativeElement).save()

        this.vistaPdf = false;
        this.toggleModalVisibility();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Descargando Pdf"
        });
      } else if (result.isDenied) {
      }
    })

  }







  }
