import { Component,OnInit } from '@angular/core';
import { FormControl,NgForm } from '@angular/forms';
import { Subscription,debounceTime } from 'rxjs';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { CobranzaService } from 'src/app/services/cobranza/cobranza.service';
import { CobranzaDto } from 'src/app/models/cobranza.model';

@Component({
  selector: 'app-corte',
  templateUrl: './corte.component.html',
  styleUrls: ['./corte.component.scss']
})
export class CorteComponent implements OnInit {

constructor(
  private vendedorService: VendedoresService,
  private cobranzaService: CobranzaService,

){}

noClients: boolean = false

ngOnInit() {

  this.searchSellerSubscription = this.searchSellerControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
         this.buscarVendedor(value);
      });
}



cobranza : any = [];
// CONSULTAR COBRANZAS
consultarCobranza(){
  const json = {
    id_cobranza: 0,
    id_comprador: 1,
    id_cliente: 0,
    fecha_inicial: "2023/08/01",
    fecha_final: "2023/08/30",
    token: "012354SDSDS01"
}

this.cobranzaService.consultarCobranza(json).subscribe(resp => {
  this.cobranza = resp.data;
  console.log('resp.data :>> ', resp.data);
})

}




//=> BUSCAR vendedor
searchSellerControl: FormControl = new FormControl();
searchSellerSubscription: Subscription = new Subscription();
searchListSeller: boolean = false;
loaderSeller: boolean = false;
autocompleteSellers: Vendedor[] = [];
isSellerSelected: boolean = false;
sellers: Vendedor[] = [];
selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0);

//FUNCION PARA HACER BÚSQUEDA DE VENDEDORES
buscarVendedor(value: string) {
   let json = {
      id_vendedor: 0,
      id_comprador: 1,
      vendedor: '',
      solo_activos: 1,
      token: '012354SDSDS01',
   };
   if (value.length <= 3) {
      this.autocompleteSellers = [];
      this.searchListSeller = false;
   } else if (!this.searchSellerSubscription.closed) {
      this.loaderSeller = true;
      this.searchListSeller = true;
      this.vendedorService.obtenerVendedores(json).subscribe(
         (resp) => {
            if (resp.ok) {
               this.sellers = resp.data;
               this.autocompleteSellers = this.sellers.filter((seller) =>
                  seller.vendedor.toLowerCase().includes(value.toLowerCase())
               );
               this.loaderSeller = false;
            }
         },
         (err) => {
            console.log(err);
            this.loaderSeller = false;
         }
      );
   }
}

//FUNCIÓN PARA ESCOGER UN VENDEDOR
seleccionarVendedor(id_vendedor: number) {
   if (id_vendedor) {
      this.selectedSeller = this.autocompleteSellers.find(
         (aSeller) => aSeller.id_vendedor === id_vendedor
      )!;
      this.searchSellerControl.setValue(this.selectedSeller.vendedor);
      this.isSellerSelected = true;
      this.searchListSeller = false;
      this.searchSellerSubscription.unsubscribe();
   } else {
      return;
   }
}

//Función para que al dar clic en el input nos suscribamos a los cambios del mismo
onFocusSellerSearch() {
   this.searchSellerSubscription = this.searchSellerControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
         this.buscarVendedor(value);
      });
}

}
