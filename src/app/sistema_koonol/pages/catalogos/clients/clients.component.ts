import { Component, Output } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Address } from 'src/app/models/addresses.model';
import { Client } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { Route } from 'src/app/models/routes.model';
import { RoutesService } from 'src/app/services/routes/routes.service';
import { GeolocationService } from '../maps/services';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { VendedoresService } from 'src/app/services/vendedores/vendedores.service';
import { Vendedor } from 'src/app/models/vendedor.model';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { WebcamImage } from 'ngx-webcam';
import { Foto } from 'src/app/models/fotografias.model';

@Component({
   selector: 'app-clients',
   templateUrl: './clients.component.html',
   styleUrls: ['./clients.component.scss'],
})

export class ClientsComponent {
   //miComprador = window.sessionStorage["comprador_gl"];
   miComprador = 1;
   miToken = '';
   miPefil = 'ADMINISTRADOR';
   miUsuario = 1;
   searchClientControl: FormControl = new FormControl();

   constructor(
      private clientService: ClientsService,
      private routesService: RoutesService,
      private vendedorService: VendedoresService,
      private geolocationService: GeolocationService,
      private imageCompress: NgxImageCompressService
   ) { }

   ngOnInit() {
      this.obtenerRutas()
      this.geolocationService.getUserLocation()
         .then(resp => {
            this.coords = resp
            this.long = this.coords[0].toString()
            this.lat = this.coords[1].toString()
            this.address.longitud = this.long
            this.address.latitud = this.lat
         })
      this.searchClientControl.valueChanges
         .pipe(debounceTime(500))
         .subscribe((value) => {
            this.buscarCliente(value);
         });
   }

   //VARIABLES PARA CADA LLAMADA A LA API
   clients: Client[] = [];
   addresses: Address[] = [];
   sellers: Vendedor[] = [];
   selectedSeller: Vendedor = new Vendedor(0, 0, '', '', 0, 0);
   routes: Route[] = []
   coords: [number, number] = [0, 0]
   long: string = ''
   lat: string = ''

   //CLIENTE QUE SE UTILIZARÁ AL CREAR UNO NUEVO
   client: Client = new Client(
      0,
      0,
      1,
      '',
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
      0,
      1,
      0
   );

   //DIRECCIÓN QUE SE UTILIZARÁ AL CREAR UN CLIENTE NUEVO
   address: Address = new Address(
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
      this.long,
      this.lat,
      1,
      []
   );

   //VARIABLE PARA DEFINIR LA SECCIÓN ACTUAL DE LAS TABS
   section: number = 1;

   //FUNCIÓN PARA ALTERNAR ENTRE TABS Y RESETEAR LA TAB ACTUAL EN CIERTOS CASOS
   tab(section: number) {
      if (section === 1) {
         this.section = 1;
      } else if (section === 2) {
         this.section = 2;
      }
   }

   //LLAMADA A LAS DIRECCIONES DE UN CLIENTE EN ESPECIAL
   obtenerDireccion(id_cliente: number) {
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

   //LLAMADA A LAS RUTAS PARA EL SELECT
   obtenerRutas() {
    let json = {
      id_ruta: 0,
      id_comprador: 1,
      token: '012354SDSDS01',
      ruta: '',
    };
      this.routesService.obtenerRutas(json).subscribe(objeto => this.routes = objeto.data)
   }

   //Autocomplete Vendedor
   searchSellerControl: FormControl = new FormControl();
   searchSellerSubscription: Subscription = new Subscription();
   searchListSeller: boolean = false;
   loaderSeller: boolean = false;
   autocompleteSellers: Vendedor[] = [];
   isSellerSelected: boolean = false;

   //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE
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
         this.client.id_vendedor = this.selectedSeller.id_vendedor
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

   //FUNCIÓN PARA MANEJAR SI UN CLIENTE SE GUARDARÁ O SE EDITARÁ
   async guardarCliente(clientForm: NgForm) {
      if (clientForm.invalid) {
         return;
      }
      if (this.selectedClient.id_cliente !== 0) {
         Swal.fire({
            title: '¿Quieres GUARDAR los cambios?',
            showDenyButton: true,
            confirmButtonText: 'SI',
            denyButtonText: `NO`,
         }).then((result) => {
            if (result.isConfirmed) {
               this.clientService
                  .editarCliente(
                     this.selectedClient.id_cliente,
                     this.selectedClient
                  )
                  .subscribe((objeto) => { })
            }
         })
      } else {
         this.clientService.agregarCliente(this.client).subscribe((objeto) => {
            this.address.id_cliente = objeto.id_cliente;
            this.guardarDireccion(clientForm).then(() => {
               this.tab(1);
            });
         });
      }
   }

   //FUNCIÓN PARA EDITAR UNA DIRECCIÓN, AÑADIR UNA DIRECCIÓN A UN CLIENTE EN ESPECÍFICO O CREARLA JUNTO A UN CLIENTE NUEVO
   async guardarDireccion(addressForm: NgForm) {
      if (addressForm.invalid) {
         return;
      }
      //PARA EDITAR UNA DIRECCIÓN
      if (this.addressSelected.id_cliente && this.addressSelected.id_direccion) {
         Swal.fire({
            title: '¿Quieres GUARDAR los cambios?',
            showDenyButton: true,
            confirmButtonText: 'SI',
            denyButtonText: `NO`,
         }).then((result) => {
            if (result.isConfirmed) {
               this.clientService
                  .editarDireccion(
                     this.addressSelected.id_direccion,
                     this.addressSelected
                  ).subscribe((resp) => {
                     this.addressSelected.id_cliente_direccion = resp.id_cliente_direccion;
                     this.obtenerDireccion(this.addressSelected.id_cliente);
                     if (this.uploadedImages.length > 0) {
                        this.savePhotos(this.addressSelected.id_cliente_direccion, this.uploadedImages).then(() => {
                           this.obtenerDireccion(this.selectedClient.id_cliente)
                           this.uploadedImages = []
                        })
                     };
                  }
                  );
               this.offAddAddressVisibility();
            }
         })
      }
      //PARA AGREGAR UNA DIRECCIÓN A UN CLIENTE YA EXISTENTE
      else if (this.addressSelected.id_cliente) {
         this.clientService
            .agregarDireccion(this.addressSelected)
            .subscribe((resp) => {
               this.addressSelected.id_cliente_direccion = resp.id_cliente_direccion;
               this.obtenerDireccion(this.addressSelected.id_cliente);
               if (this.uploadedImages.length > 0) {
                  this.savePhotos(this.addressSelected.id_cliente_direccion, this.uploadedImages).then(() => {
                     this.obtenerDireccion(this.selectedClient.id_cliente)
                     this.uploadedImages = []
                  })
               }
            });
         this.offAddAddressVisibility();
      }
      //PARA CREAR UNA DIRECCIÓN JUNTO A UN CLIENTE NUEVO
      else {
         this.clientService
            .agregarDireccion(this.address)
            .subscribe((resp) => {
               this.address.id_cliente_direccion = resp.id_cliente_direccion;
               if (this.uploadedImages.length > 0) {
                  this.savePhotos(this.address.id_cliente_direccion, this.uploadedImages).then(() => {
                     this.resetClientAddress();
                     this.obtenerDireccion(this.selectedClient.id_cliente)
                  })
               }
            });
      }
   }

   //SECCIÓN PARA MANEJAR LA BÚSQUEDA DE CLIENTES Y LOS CLIENTES FILTRADOS
   searchClient: string = '';
   autocompleteClients: Client[] = [];
   selectedClient: Client = new Client(0, 0, 1, 'toker ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 0, 0, 0, 0, 0, 1, 0);
   isClientSelected: boolean = false;
   addAddressVisibility: boolean = false;
   searchList: boolean = false;
   loader: boolean = false
   noClients: boolean = false
   addressSelected: Address = new Address(0, 0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', this.long, this.lat, 1, []);

   //FUNCION PARA HACER BÚSQUEDA DE CLIENTES POR NOMBRE O RFC
   buscarCliente(value: string) {
      let json = {
         id_cliente: 0,
         id_comprador: this.miComprador,
         cliente: '',
         token: this.miToken,
      }
      if (value.length <= 3) {
         this.autocompleteClients = [];
         this.searchList = false;
      } else {
         this.loader = true
         this.searchList = true;
         this.clientService.obtenerClientes(json).subscribe(
            (resp) => {
               if (resp.ok) {
                  this.clients = resp.data
                  this.autocompleteClients = this.clients.filter((client) =>
                     client.cliente.toLowerCase().includes(value.toLowerCase()) ||
                     client.rfc?.toLowerCase().includes(value.toLowerCase())
                  );
                  this.loader = false
               }
            },
            (err) => {
               console.log(err)
               this.loader = false
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
         this.isClientSelected = true;
         this.obtenerDireccion(id_cliente);
         this.searchList = false;
         this.addressSelected.id_cliente = id_cliente;
         this.addAddressVisibility = false;
         this.tab(1);
         console.log(this.selectedClient);
      } else {
         return;
      }
   }

   //FUNCIÓN PARA SELECCIONAR LA DIRECCIÓN A EDITAR
   editarDireccion(id_cliente_direccion: number) {
      this.clientService.obtenerDirecciones(0, id_cliente_direccion).subscribe(resp => {
         this.addressSelected = resp.data[0]
         if (this.addressSelected.fotos.length > 0) {
            this.uploadedImages = []
            this.addressSelected.fotos.forEach((objetoFoto) => {
               this.uploadedImages.push(objetoFoto.fotografia)
            })
         } else { this.uploadedImages = [] }
      });
      this.addAddressVisibility = true;
   }

   //FUNCIÓN PARA DESHABILITAR LA VISTA DE CUANDO SE ESTÁ AÑADIENDO O EDITANDO UNA DIRECCIÓN Y REGRESAMOS A LA PÁGINA DE AÑADIR CLIENTE
   offAddAddressVisibility() {
      this.addAddressVisibility = false
   }


   //FUNCIÓN QUE SE UTILIZA PARA AÑADIR UN CLIENTE CUANDO YA ESTAMOS DENTRO DE UN CLIENTE ESPECÍFICO
   addClient() {
      this.selectedClient = new Client(
         0,
         0,
         1,
         '',
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
         0,
         1,
         0
      );
      this.addressSelected = new Address(
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
      )

      this.isClientSelected = false;
      this.tab(1);
      this.offAddAddressVisibility();
      this.resetClientAddress()
      this.searchClientControl.reset()
   }

   resetClientAddress() {
      this.client = new Client(
         0,
         0,
         1,
         '',
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
         0,
         1,
         0
      );
      this.address = new Address(
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
         this.long,
         this.lat,
         1,
         []
      )
      this.uploadedImages = []
   }

   //FUNCIÓN PARA QUE AL QUERER AÑADIR UNA DIRECCIÓN A UN CLIENTE EXISTENTE, SE PASE EL ID DEL MISMO Y SE ABRA EL FORM
   createAddress() {
      this.uploadedImages = []
      this.addressSelected = new Address(
         0, this.selectedClient.id_cliente, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', this.long, this.lat, 1, [])
      this.addAddressVisibility = true
   }

   //FUNCIÓN PARA VER LAS FOTOS DE UNA DIRECCIÓN
   modalPhotos: boolean = false
   direccionSeleccionadaFotos: Address = new Address(0, 0, 0, 0, '', '', '', '', '', '', '', 0, '', '', '', '', '', '', 1, []);

   toggleModalPhotos() {
      this.modalPhotos = !this.modalPhotos;
   }

   verFotosDireccion(id_cliente_direccion: number) {
      this.direccionSeleccionadaFotos = this.addresses.find(address => address.id_cliente_direccion === id_cliente_direccion)!;
      this.toggleModalPhotos()
   }

   //MODAL PARA AÑADIR FOTOS AL CLIENTE Y PARA AÑADIRLE UNA UBICACIÓN
   extraModal: boolean = false;
   ubicacionVendedor: any;
   imageCount: number = 0;
   uploadedImages: any[] = [];
   imageAfterResize: any;
   mainImage: any;
   takingPhoto: boolean = false;
   private trigger: Subject<void> = new Subject<void>();
   public triggerObservable: Observable<void> = this.trigger.asObservable();

   //FUNCIÓN PARA ABRIR MODAL PARA AÑADIR FOTOS AL CLIENTE
   togglePhotosModal() {
      this.extraModal = !this.extraModal;
      this.takingPhoto = false;
      this.mainImage = this.uploadedImages[0];
   }

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
      this.clientService.guardarFotosDireccion(id_cliente_direccion, imagenes).subscribe()
   }
}
