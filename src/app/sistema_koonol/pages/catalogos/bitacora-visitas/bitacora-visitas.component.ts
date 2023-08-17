import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime } from 'rxjs';
import { Client } from 'src/app/models/clients.model';
import { VendedorVisitas } from 'src/app/models/vendedorVisitas.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { VisitasService } from 'src/app/services/visitas/visitas.service';

@Component({
  selector: 'app-bitacora-visitas',
  templateUrl: './bitacora-visitas.component.html',
  styleUrls: ['./bitacora-visitas.component.scss']
})
export class BitacoraVisitasComponent implements OnInit {

    //LOCAL
    dataStorage: any = JSON.parse(localStorage.getItem('dataPage')!)
    miToken = this.dataStorage.token;
    miUsuario = this.dataStorage.id_usuario;
    miAlmacen = this.dataStorage.id_almacen;
  
    miPefil = 'ADMINISTRADOR';
    miComprador = 1;

  constructor(
    private visitasService: VisitasService,
    private clienteService: ClientsService
  ) { }

  ngOnInit(): void {
    this.obtenerBitacoraVisitas();
  }

  visitasDeVendedores: VendedorVisitas[] = [];
  visitasDeVendedor: VendedorVisitas = new VendedorVisitas(0, '', []);

  obtenerBitacoraVisitas(): void {
    let json = {
      id_visita: 0,
      id_vendedor: 1,
      id_cliente: 0,
      fecha_inicial: '2023/8/17',
      fecha_final: '2023/8/17',
      token: this.miToken,
    }
    this.visitasService.consultarBitacoraVisitas(json)
      .subscribe(resp => {
        this.visitasDeVendedores = resp.data
        console.log(resp);
      }
      )
  }

  //////PARA BUSCAR CLIENTES/////////////////////

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
      token: this.miToken,
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
