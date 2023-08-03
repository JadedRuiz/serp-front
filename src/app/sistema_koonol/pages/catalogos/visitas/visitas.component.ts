import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SERV_VISITAS } from 'src/config/config';
import { VisitasDTO } from 'src/app/models/visitas.model';
import { VisitasService } from 'src/app/services/visitas/visitas.service';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2';
import { FormControl,NgForm } from '@angular/forms';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';



@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit {

  visitas: VisitasDTO[] = [];
  vendedorActual: any;



  constructor(
    private visitasService: VisitasService,
    private clienteService: ClientsService,
    private datePipe: DatePipe,
		private router: Router,

    ) { }



  ngOnInit() {


    this.searchClientControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe((value) => {
      this.buscarCliente(value);
    });

    this.obtenerVisitas();
  }


//Nueva Visita
nuevaVisita(){
 this.router.navigate(['/sis_koonol/catalogos/nueva-visita']);
}


// MODAL
editandoNotas = false;
editandoFecha = false;
editarVisita: VisitasDTO = {
  id_visita: 0,
  vendedor: '',
  id_vendedor: 0,
  id_cliente: 0,
  cliente: '',
  fecha_visita: '',
  contacto: '',
  notas: '',
  cancelado:0,
  fecha_siguiente_visita: '', // Asegúrate de inicializar esta propiedad
  // ... otras propiedades
};


abrirModalEditar(visita: VisitasDTO) {
  this.editarVisita = visita;
  // Cambia el valor de editandoNotas y editandoFecha según tus necesidades
  this.editandoNotas = true;
  this.editandoFecha = true;
}

cerrarModal() {
  // Lógica para cerrar el modal
}
guardarCambios(visitasForm : NgForm){
 // console.log("hola", coords);
   this.visitasService.agregarVisitas(this.editarVisita).subscribe((object) => {
      console.log('visitasForm:', this.editarVisita);
   });
}



//Transformando fecha Visita
formatearFecha(fecha: any){
  return this.datePipe.transform(fecha, 'dd/MM/yyyy');
}

//=> BUSCAR VISITAS
vendedorId= 21
token= '123';
fechaInicio: string = '';
fechaFinal: string = '';



  obtenerVisitas() {
    let json = {
      id_visita: 0,
      id_vendedor: this.vendedorId,
      id_cliente: this.selectedClient.id_cliente,
      fecha_inicial: this.fechaInicio,
      fecha_final: this.fechaFinal,
      token: this.token,
    };

    console.log('json :>> ', json);
this.visitasService.consultarVisitas(json).subscribe((resp)=>{
  if(resp.ok){
    this.visitas = resp.data;
    if (this.visitas.length > 0) {
      this.vendedorActual = this.visitas[0].vendedor; // Corregimos el nombre
    }
    console.log('visitas :>> ', this.visitas);
  }else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text:   'Ha ocurrido un error',
    });
    //console.log(response.message);
  }
})

  }


  //////PARA BUSCAR CLIENTES/////////////////////

  clients:Client[]=[];
  searchClient: string = '';
  autocompleteClients: any[] = [];
  selectedClient: Client = new Client(0, 0, 1, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 0, 0, 0, 0, 0, 1, 0);
  searchClientSubscription: Subscription = new Subscription();
  isClientSelected: boolean = false;
  searchList: boolean = false;
  loader: boolean = false
  noClients: boolean = false
  searchClientControl: FormControl = new FormControl();


  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
  buscarCliente(value: string) {
    let json = {
      id_cliente: 0,
      id_comprador:1,
      cliente: '',
      token: '',
    }
    if (value.length <= 3) {
      this.autocompleteClients = [];
      this.searchList = false;
    } else if (!this.searchClientSubscription.closed) {
      this.loader = true;
      this.searchList = true;
      this.clienteService.obtenerClientes(json).subscribe(
        (resp) => {
          if (resp.ok) {
            this.clients = resp.data;
            this.autocompleteClients = this.clients.filter(
              (client) =>
                client.cliente.toLowerCase().includes(value.toLowerCase()) ||
                client.rfc?.toLowerCase().includes(value.toLowerCase())
            );
            console.log(this.autocompleteClients);
            this.loader = false;
          }
        },
        (err) => {
          console.log(err);
          this.loader = false;
        }
      );
    }
  }

  //FUNCIÓN PARA ESCOGER UN CLIENTE Y GUARDAR SU ID EN addressSelected
  seleccionarCliente(id_cliente: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.find(
        (aclient) => aclient.id_cliente === id_cliente
      );
      //this.visita.id_cliente = id_cliente;
      this.isClientSelected = true;
      this.searchList = false;
      this.searchClientControl.setValue(this.selectedClient.cliente)
      this.searchClientSubscription.unsubscribe();
    } else {
      return;
    }
  }

    //Función para que al dar clic en el input nos suscribamos a los cambios del mismo
    onFocusClientSearch() {
      this.searchClientSubscription = this.searchClientControl.valueChanges
        .pipe(debounceTime(500))
        .subscribe((value) => {
          this.buscarCliente(value);
        });
      // console.log("Estás sobre el input: ", this.searchClientSubscription);
    }


}
