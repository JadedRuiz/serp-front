import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.scss']
})
export class VendedoresComponent {
  constructor(private vendedorService: VendedoresService){}

ngOnInit(){
  this.obtenerVendedor()
}
@ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  vendedores: any [] = [];
  searchVendedor: string = ''
  autocompleteVendedor: any[]= [];
  isVendedorSeleccionado: boolean = false;
  vendedorSeleccionado: Vendedor []= [];
  searchList: boolean = false;
  vendedor: Vendedor = new Vendedor(0,1,'','',1,1,);


//=> Obtener Vendedor
  obtenerVendedor(){
this.vendedorService.obtenerVendedores().subscribe(
  (response)=>{
    if(response.ok){
      this.vendedores = response.data;
    }else {
console.log(response.message);
    }
  },
  (error)=>{
    console.log(error);
  }
);
}

//Busca Vendedor =>
buscarVendedor(){
if (this.searchVendedor.length <= 2){
  this.autocompleteVendedor = [];
}else {
  this.searchList = true;
  this.vendedorService.obtenerVendedores();
  this.autocompleteVendedor = this.vendedores.filter((vendedor)=>
  vendedor.vendedor.toLowerCase().includes(this.searchVendedor.toLowerCase()));
}
}


//Selecciona Vendedor =>
selecionarVendedor(id_vendedor:number){
if(id_vendedor){
  this.vendedor=this.autocompleteVendedor.filter(
    (vendedor)=> vendedor.id_vendedor === id_vendedor)[0];
  this.isVendedorSeleccionado = true;
  this.searchList = false;
}else {
  this.vendedorSeleccionado = [];
}
}


//Activa campos para agregar nuevo Vendedor
cargarCampos(){
  this.vendedor = new Vendedor(0,1,'','',1,1,);
  this.activarCampos();
}

//Guarda Vendedor =>
guardarVendedor(vendedorForm: NgForm){
  if(vendedorForm.invalid){
return;
}if (this.vendedor.id_vendedor){
  this.vendedorService.editarVendedor(this.vendedor.id_vendedor,this.vendedor)
  .subscribe((objeto) =>{});
  console.log('editamos');
}else {
  this.vendedorService.agregarVendedor(this.vendedor).subscribe((objeto)=>{
    this.vendedorService.obtenerVendedores();
  })
  console.log('guardamos');
  this.vendedorService.obtenerVendedores();
}
}

// Activar Vendedor =>
activarVendedor(id_vendedor:number, activo:number){
this.vendedorService.activarVendedor(id_vendedor,activo).subscribe((objeto)=>{
  this.obtenerVendedor();
  console.log('activar', this.vendedor);
})
}





//habilitar los comapos del input
activarCampos() {
  this.provInputs.forEach(
    provInput => {
      provInput.nativeElement.disabled = false
    }
    )
  }



status = false
cambiarEstado() {
  if (this.status) {
    this.status = false
  }
  else {
    this.status = true
  }
}

section: number = 1

tab(section: number) {
  if (section === 1) {
    this.section = 1
  }
  else if (section === 2) {
    this.section = 2
  }
}
}
