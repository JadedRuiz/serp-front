import { Component, OnInit } from '@angular/core';
import { VisitasDTO } from 'src/app/models/visitas.model';
import { VisitasService } from 'src/app/services/visitas/visitas.service';
import Swal from 'sweetalert2';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Client } from 'src/app/models/clients.model';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';





@Component({
  selector: 'app-control-visitas',
  templateUrl: './control-visitas.component.html',
  styleUrls: ['./control-visitas.component.scss'],
})
export class ControlVisitasComponent implements OnInit {

  constructor(
    private visitasService: VisitasService,
    private clienteService: ClientsService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,


    ) {

    }

    ngOnInit() {
      this.searchClientControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.buscarCliente(value);
      });
      this.obtenerVisitas();
    }





//=> BUSCAR VISITAS

vendedorId = 1
fechaInicio: string = '';
fechaFinal: string = '';
visitas: VisitasDTO[] = [];
visitasFiltradas: VisitasDTO[] = [];

    //  CALENDARIO
    selectedDate = '';

// FORMATEAR FECHA
formatDate(date: Date): string {
  return this.dateAdapter.format(date, 'yyyy-MM-dd');
}

onDateSelected(event: any): void {
  this.selectedDate = this.formatDate(event);
  this.visitasFiltradas = this.visitas.filter((visita) => {
    const visitaDate = visita.fecha_siguiente_visita.split(' ')[0]; // Extrae la fecha de visita
    return visitaDate === this.selectedDate;
  });
this.obtenerVisitas();

}


//Nueva Visita
nuevaVisita() {
  this.router.navigate(['/sis_koonol/catalogos/nueva-visita']);
}


obtenerVisitas() {
  let json = {
    id_visita: 0,
    id_vendedor: this.vendedorId,
    id_cliente: 0,
    fecha_inicial: this.fechaInicio,
    fecha_final: this.fechaFinal,
    token: 'a5a81a5sd16234a6s5d',
  };

  this.visitasService.consultarVisitas(json).subscribe((resp) => {
    if (resp.ok) {
      this.visitas = resp.data;

      if (this.visitas.length > 0) {
       // this.vendedorActual = this.visitas[0].vendedor; // Corregimos el nombre
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error',
      });
    }
  })

}


// PARA BUSCAR CLIENTES

clients: Client[] = [];
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
    id_comprador: 1,
    cliente: '',
    token: 'this.miToken',

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
}

}
