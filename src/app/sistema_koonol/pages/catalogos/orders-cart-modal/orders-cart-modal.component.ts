import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { GeolocationService } from '../maps/services';
import { Client } from 'src/app/models/clients.model';
import { Address } from 'src/app/models/addresses.model';
import { Subscription, catchError, debounceTime } from 'rxjs';
import { Vendedor } from 'src/app/models/vendedor.model';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { LOCALE_ID } from '@angular/core';
//Importes para calendario
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CatalogoService } from 'src/app/services/catalogo/catalogo.service';
import { Articulo } from 'src/app/models/articulo.model';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';
import { Pedido } from 'src/app/models/pedido.model';
import { PedidoGuardar } from 'src/app/models/pedidoguardar.model';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import Swal from 'sweetalert2';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-orders-cart-modal',
  templateUrl: './orders-cart-modal.component.html',
  styleUrls: ['./orders-cart-modal.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'de-DE' }, // for German translation. Ignore this if not needed.
  ],
})

export class OrdersCartModalComponent implements OnInit {

  //DESPUÉS VENDRÁ DESDE ALGO QUE HARÁ JADED (mentira)
  dataStorage: any = JSON.parse(localStorage.getItem('dataPage')!)
  miToken = this.dataStorage.token;
  miUsuario = this.dataStorage.id_usuario;
  miAlmacen = this.dataStorage.id_almacen

  miPefil = 'ADMINISTRADOR';
  miComprador = 1;
  vendedor = 0;

  //VARIABLES FUNDAMENTALES EN LA APLICACIÓN
  //Autocomplete Cliente
  searchClientControl: FormControl = new FormControl();
  searchClientSubscription: Subscription = new Subscription();
  clients: Client[] = [];
  addresses: Address[] = [];
  //Autocomplete Vendedor
  searchSellerControl: FormControl = new FormControl();
  searchSellerSubscription: Subscription = new Subscription();
  sellers: Vendedor[] = [];
  //Coordenadas para la ubicación actual
  coords: [number, number] = [0, 0];
  //Calendario
  currentDate: any;
  selectedDate: any;
  selectedDateFormatted: string = '';
  isDateSelected: boolean = false;
  //Variable para almacenar los productos del pedido para el carrito
  pedido: Articulo[] = [];
  pedidoFinal: PedidoGuardar = new PedidoGuardar(0, 1, 0, 0, this.miToken, '', '', 1, [], 0, 0);
  formatter: any;
  precioTotalFormateado: any;

  constructor(
    private clientService: ClientsService,
    private vendedorService: VendedoresService,
    private catalogoService: CatalogoService,
    private router: Router,
    private pedidos: PedidosService,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
    console.log(localStorage.getItem('dataPage'))
    this.formatter = new Intl.NumberFormat('en-NZ', {
      currency: 'NZD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.catalogoService.getPedido();
    this.catalogoService.pedido$.subscribe((pedido) => (this.pedido = pedido));
    if (this.vendedor !== 0) {
      this.selectSellerVisibility = true;
      this.isSellerSelected = true;
    }
    this.pedidos.pedidoFinal$.subscribe((pedidoFinal) => {
      this.pedidoFinal = pedidoFinal;
    });
    const currentDate = new Date();
    this.currentDate = currentDate;
  }

  //Llamada a la función toggleModalVisibility que viene del componente catalogo
  useToggleModalVisibility() {
    this.toggleModalVisibility.emit();
  }

  //LLAMADA A LAS DIRECCIONES DE UN CLIENTE EN ESPECIAL
  obtenerDirecciones(id_cliente: number) {
    this.clientService.obtenerDirecciones(id_cliente).subscribe(
      (response) => {
        if (response.ok) {
          this.addresses = response.data;
        } else {
          console.log('Ocurrió un error', response.message);
        }
      },
      (error) => {
        console.log('Error de conexión', error);
      }
    );
  }

  //MODAL BASE
  @Output() toggleModalVisibility = new EventEmitter();

  //Autocomplete Cliente
  searchListCliente: boolean = false;
  loaderCliente: boolean = false;
  noClients: boolean = false;
  autocompleteClients: Client[] = [];
  selectedClient: Client = new Client(
    0,
    0,
    this.miComprador,
    this.miToken,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0,
    this.miUsuario,
    1,
    0
  );

  isClientSelected: boolean = false;
  addressSelected: Address = new Address(
    0,
    0,
    0,
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    1,
    []
  );

  //Autocomplete Vendedor
  selectSellerVisibility: boolean = false;
  searchListSeller: boolean = false;
  loaderSeller: boolean = false;
  autocompleteSellers: Vendedor[] = [];
  selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0);
  isSellerSelected: boolean = false;

  //MODAL PARA SELECCIONAR UN CLIENTE
  clienteVendedorModal: boolean = true;
  observaciones: string = ''

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
  buscarCliente(value: string) {
    let json = {
      id_cliente: 0,
      id_comprador: this.miComprador,
      cliente: '',
      token: this.miToken,
    };
    if (value.length <= 3) {
      this.autocompleteClients = [];
      this.searchListCliente = false;
    } else if (!this.searchClientSubscription.closed) {
      this.loaderCliente = true;
      this.searchListCliente = true;
      this.clientService.obtenerClientes(json).subscribe(
        (resp) => {
          if (resp.ok) {
            this.clients = resp.data;
            this.autocompleteClients = this.clients.filter(
              (client) =>
                client.cliente.toLowerCase().includes(value.toLowerCase()) ||
                client.rfc?.toLowerCase().includes(value.toLowerCase())
            );
            this.loaderCliente = false;
          }
        },
        (err) => {
          console.log(err);
          this.loaderCliente = false;
        }
      );
    }
  }

  //FUNCIÓN PARA ESCOGER UN CLIENTE Y GUARDAR SU ID EN addressSelected
  seleccionarCliente(id_cliente: number) {
    if (id_cliente) {
      this.selectedClient = this.autocompleteClients.find(
        (aclient) => aclient.id_cliente === id_cliente
      )!;
      this.searchClientControl.setValue(this.selectedClient.cliente);
      this.isClientSelected = true;
      this.obtenerDirecciones(id_cliente);
      this.searchListCliente = false;
      this.addressSelected.id_cliente = id_cliente;
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

  //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE
  buscarVendedor(value: string) {
    let json = {
      id_vendedor: 0,
      id_comprador: this.miComprador,
      vendedor: '',
      solo_activos: 1,
      token: this.miToken,
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

  //Función para formatear la fecha que viene del calendario de angular material
  seleccionarFecha(event: MatDatepickerInputEvent<Date>) {
    //FORMATEAR LA FECHA
    // Crear un objeto Date con la cadena de fecha
    let dateString = this.selectedDate._d; //Conseguimos el string en el formato que trae angular material
    let date = new Date(dateString);

    // Obtener los componentes de la fecha
    let day = date.getDate();
    let month = date.getMonth() + 1; // Los meses comienzan desde 0, por lo que debemos sumar 1
    let year = date.getFullYear();

    // Formatear la fecha en el orden deseado (dd-MM-yyyy)
    let dateFormatted =
      year.toString() +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      day.toString().padStart(2, '0')

    this.selectedDateFormatted = dateFormatted; //Variable que almacena la fecha ya seleccionada y que se pasará al pedido

    //ACTIVAR EL BOOLEANO DE FECHA SELECCIONADA
    this.isDateSelected = true;
  }

  //Función para ir añadiendo la información seleccionada en el pedido y avanzar al siguiente paso
  confirmClient() {
    this.clienteVendedorModal = false;
    this.selectAddressModal = true;
    this.pedidoFinal.id_vendedor = this.selectedSeller.id_vendedor;
    this.pedidoFinal.fecha_entrega = this.selectedDateFormatted;
    this.pedidoFinal.observaciones = this.observaciones;
    this.pedidoFinal.token = this.miToken
    this.pedidos.updatePedidoFinal(this.pedidoFinal);
  }

  //MODAL PARA SELECCIONAR UNA DIRECCIÓN
  //Estado para manipular la visibilidad del modal de seleccionar dirección
  selectAddressModal: boolean = false;
  isAddressSelected: boolean = false;

  selectAddress(address: Address) {
    this.isAddressSelected = true;
    this.addressSelected = address;
  }

  backToClientModal() {
    this.clienteVendedorModal = true;
    this.selectAddressModal = false;
  }

  confirmAddress() {
    this.selectAddressModal = false;
    this.finPedidoModal = true;
    this.pedidoFinal.id_cliente_direccion = this.addressSelected.id_cliente_direccion;
    this.precioTotalFormateado = this.formatter.format(
      this.pedidoFinal.precio_total
    );
    this.pedidos.updatePedidoFinal(this.pedidoFinal);
  }

  //MODAL PARA FINALIZAR EL PEDIDO
  finPedidoModal: boolean = false;

  backToAddressModal() {
    this.selectAddressModal = true;
    this.finPedidoModal = false;
  }

  async saveOrder() {
    return this.pedidos.guardarPedido(this.pedidoFinal).subscribe();
  }

  async finishOrder() {
    await this.saveOrder().then(() => {
      this.pedido = [];
      this.catalogoService.updatePedido(this.pedido)
      this.router.navigate(['/sis_koonol/catalogos/pedidos-realizados']);
    })
  }

  openExtraModal() {
    this.extraModal = true;
    this.finPedidoModal = false;
  }


  //MODAL PARA AÑADIR FOTOS AL CLIENTE Y PARA AÑADIRLE UNA UBICACIÓN
  extraModal: boolean = false;
  ubicacionVendedor: number[] = [];
  imageCount: number = 0;
  uploadedImages: any[] = [];
  imageAfterResize: any;
  mainImage: any;
  takingPhoto: boolean = false;
  private trigger: Subject<void> = new Subject<void>();
  public triggerObservable: Observable<void> = this.trigger.asObservable();

  //FUNCIÓN PARA ABRIR MODAL PARA AÑADIR FOTOS AL CLIENTE
  //Función para subir fotografía desde el dispositivo
  uploadImage() {
    if (this.uploadedImages.length >= 4) {
      alert('Solo se pueden subir un máximo de 4 imágenes');
      return;
    }

    return this.imageCompress
      .uploadFile()
      .then(({ image, orientation }: UploadResponse) => {
        if (this.imageCompress.byteCount(image) > 5 * 1024 * 1024) {
          alert('El tamaño de la imagen excede el límite de 5 MB');
          return;
        }
        this.imageCompress
          .compressFile(image, orientation, 40, 40, 400, 400)
          .then((result: DataUrl) => {
            this.uploadedImages.push(result);
            this.imageCount++;
            this.displayImage(this.uploadedImages.length - 1);
          });
      });
  }

  //Fucnión para abrir la cámara
  openWebcam() {
    if (this.uploadedImages.length >= 4) {
      alert('Solo se pueden subir un máximo de 4 imágenes');
      return;
    }
    this.takingPhoto = true;
  }

  //Función para cerrar la cámara
  closeWebcam() {
    this.takingPhoto = false
  }

  //Función para tomar la fotografía
  capturePhoto() {
    this.trigger.next()
  }

  //Función para comprimir las fotografías que se toman
  async compressImage(image: any) {
    return await this.imageCompress.compressFile(image, -1, 50, 50); // Ajusta el nivel de compresión aquí
  }

  //Función para mandar la fotografía al array de fotos subidas y mostrarla
  async pushPhoto(imagen: WebcamImage) {
    await this.compressImage(imagen.imageAsDataUrl).then((result: DataUrl) => {
      this.uploadedImages.push(result);
      this.imageCount++;
      this.mainImage = result;
      this.takingPhoto = false;
    })
  }

  //Fucnión para alternar la fotografía principal
  displayImage(index: number) {
    this.mainImage = this.uploadedImages[index];
  }

  async savePhotos(id_cliente_direccion: number, fotos: any[]) {
    let imagenes = fotos.filter((image) => {
      if (image.includes('data:image/jpeg;base64')) {
        return image;
      } else {
        return;
      }
    });
    this.clientService.guardarFotosDireccion(id_cliente_direccion, imagenes).subscribe(resp => {
      if (resp) {
        Swal.fire('Fotos guardadas exitosamente', '', 'success')
        if(this.ubicacionVendedor.length > 0) {
         this.guardarUbi()
        }
        this.backToFinishOrder()
        this.uploadedImages = []
      }
    }
    )
  }

  //FUNCIÓN PARA OBTENER UBICACIÓN
  obtenerUbi() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.ubicacionVendedor = [
          position.coords.longitude,
          position.coords.latitude
        ];
        Swal.fire('Ubicacion guardada correctamete', '', 'success');
        console.log("hola", this.ubicacionVendedor);
      },
        (error) => {
          console.log(error);
        });
    };
  }

  //FUNCIÓN PARA GUARDAR LA UBICACIÓN
  async guardarUbi() {
    this.clientService.guardarUbicacionDireccion(this.addressSelected.id_cliente_direccion, this.ubicacionVendedor[0], this.ubicacionVendedor[1]).subscribe(resp =>  console.log(resp));
  }

  backToFinishOrder() {
    this.extraModal = false;
    this.finPedidoModal = true;
  }

  async saveExtraChanges() {
    await this.savePhotos(this.addressSelected.id_cliente_direccion, this.uploadedImages)
  }

}
