import { Component, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subject, Subscription, debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { WebcamImage } from 'ngx-webcam';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Usuario } from 'src/app/models/usuario.model';
import { AlmacenService } from 'src/app/services/almacenes/almacen.service';
import { Almacen } from 'src/app/models/almacen.model';
import { PerfilService } from 'src/app/services/perfiles/perfil.service';
import { Perfil } from 'src/app/models/perfil.model';

@Component({
   selector: 'app-usuarios',
   templateUrl: './usuarios.component.html',
   styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

   datastorage: any = JSON.parse(localStorage.getItem('dataPage')!);
   miComprador = 1;
   miToken = "VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0=";
   miPerfil = 'ADMINISTRADOR';
   miUsuario = 1;

   constructor(
      private perfilService: PerfilService,
      private usuarioService: UsuariosService,
      private almacenService: AlmacenService,
      private imageCompress: NgxImageCompressService,
   ) {}

   ngOnInit() {
      this.obtenerAlmacenes()
      this.obtenerPerfiles()
  }

   //COSAS DE ALMACENES
   almacenes: Almacen[] = [];
   almacenesSeleccionados: any[] = [];

   obtenerAlmacenes() {
      let json = {
         id_almacen: 0,
         id_comprador: 1,
         almacen: '',
         solo_activos: 1,
         token: this.miToken,
      };
      this.almacenService.obtenerAlmacenes(json).subscribe((objeto) => {
         this.almacenes = objeto.data.map((almacen:any) => ({ ...almacen, selected: false }));
     });
   }



//COSAS PARA PERFILES
perfiles : Perfil [] =[];

obtenerPerfiles(){
 let  json = {
    id_perfil: 0,
    perfil: '',
    token: this.miToken,
  };
this.perfilService.obtenerPerfil(json).subscribe(
  (resp) => {
      if (resp.ok) {
         this.perfiles = resp.data;
      } else {
         Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error',
         });
      }
    }
  );
}



   getSelectedOptions() {
      this.almacenesSeleccionados = this.almacenes.filter(almacen => almacen.selected);
      console.log('Opciones seleccionadas:', this.almacenesSeleccionados);
    }

   //COSAS DE USUARIOS
   usuarios: Usuario[] = [];
   autocompleteUsuario: Usuario[] = [];
   usuario: Usuario = new Usuario(0, 1, this.miToken, '', '', '',1,1,1,0,'','',0,[]);
   status: boolean = false;

   @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

   //=> Obtener Usuarios
   obtenerUsuario() {
      let json = {
         id_usuario: 0,
         id_comprador: this.miComprador,
         usuario: '',
         solo_activos: 1,
         token: this.miToken,
      };
      this.usuarioService.obtenerUsuarios(json).subscribe(
         (response) => {
            if (response.ok) {
               this.usuarios = response.data;
            } else {
               Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Error',
                  text: 'Ha ocurrido un error',
               });
            }
         },
         (error) => {
            console.log(error);
         }
      );
   }

   //Autocomplete Usuario
   searchUserControl: FormControl = new FormControl();
   searchUserSubscription: Subscription = new Subscription();
   searchListUser: boolean = false;
   loaderUser: boolean = false;
   autocompleteUsers: Usuario[] = [];
   isUserSelected: boolean = false;
   users: Usuario[] = [];

   //FUNCION PARA HACER BÚSQUEDA DE USUARIOS POR NOMBRE
   buscarUsuario(value: string) {
      let json = {
         id_usuario: 0,
         id_comprador: 1,
         usuario: '',
         solo_activos: 1,
         id_usuario_consulta: 0,
         token: this.miToken,
      };
      if (value.length <= 3) {
         this.autocompleteUsers = [];
         this.searchListUser = false;
      } else if (!this.searchUserSubscription.closed) {
         this.loaderUser = true;
         this.searchListUser = true;
         this.usuarioService.obtenerUsuarios(json).subscribe(
            (resp) => {
               if (resp.ok) {
                  this.users = resp.data;
                  this.autocompleteUsers = this.users.filter((user) =>
                     user.nombre.toLowerCase().includes(value.toLowerCase())
                  );
                  this.loaderUser = false;
               }
            },
            (err) => {
               console.log(err);
               this.loaderUser = false;
            }
         );
      }
   }

   //FUNCIÓN PARA ESCOGER UN VENDEDOR
   seleccionarUsuario(id_usuario: number) {
      if (id_usuario) {
         this.usuario = this.autocompleteUsers.find(
            (aUser) => aUser.id_usuario === id_usuario
         )!;
         this.searchUserControl.setValue(this.usuario.usuario);
         this.isUserSelected = true;
         this.searchListUser = false;
         this.searchUserSubscription.unsubscribe();
      } else {
         return;
      }
   }

   //Función para que al dar clic en el input nos suscribamos a los cambios del mismo
   onFocusUserSearch() {
      this.searchUserSubscription = this.searchUserControl.valueChanges
         .pipe(debounceTime(500))
         .subscribe((value) => {
            this.buscarUsuario(value);
         });
   }

   //Activa campos para agregar nuevo Usuario
   cargarCampos() {
      this.usuario = new Usuario(0, 1, this.miToken, '', '', '',1,1,1,0,'','',0,[]);
      this.searchUserControl.setValue('');
      this.activarCampos();
   }

   //Guarda Usuario =>
   guardarUsuario(usuarioForm: NgForm) {
    console.log('=>',this.usuario);
      if (usuarioForm.invalid) {
         return;
      }
      if (this.usuario.id_usuario) {
         this.usuarioService
            .editarUsuario(this.usuario.id_usuario, this.usuario)
            .subscribe((objeto) => { });
      } else {
         this.usuarioService
            .agregarUsuario(this.usuario)
            .subscribe((objeto) => {
               this.obtenerUsuario;
            });
         usuarioForm.resetForm();
      }
   }

   // Activar/Desactivar Usuario =>
   activarUsuario(id_usuario: number, activo: number) {
      let textoAlert = activo == 1 ? '¿Quieres DESACTIVAR este usuario?' : '¿Quieres ACTIVAR este usuario?'
      Swal.fire({
         title: textoAlert,
         showDenyButton: true,
         confirmButtonText: 'SI',
         denyButtonText: `NO`,
      }).then((result) => {
         if (result.isConfirmed) {
            this.usuarioService.activarUsuario(id_usuario, activo).subscribe((objeto) => {
               this.obtenerUsuario();
            });
         }
      })
   }

   getUsuarioStatusClass(activo: number): string {
      return activo == 1 ? 'btn-success' : 'btn-danger';
   }

   getUsuarioStatusText(activo: number): string {
      return activo == 1 ? 'ACTIVO' : 'DESACTIVADO';
   }

   //habilitar los comapos del input
   activarCampos() {
      this.provInputs.forEach((provInput) => {
         provInput.nativeElement.disabled = false;
      });
   }

   cambiarEstado() {
      if (this.status) {
         this.status = false;
      } else {
         this.status = true;
      }
   }

   section: number = 1;

   tab(section: number) {
      if (section === 1) {
         this.section = 1;
      } else if (section === 2) {
         this.section = 2;
      }
   }

   //MODAL PARA ASIGNARLE ALMACENES AL USUARIO
   almacenesModal: boolean = false;

   toggleAlmacenesModal() {
      this.almacenesModal = !this.almacenesModal;
   }

   //MODAL PARA AÑADIR FOTOS AL USUARIO
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

   async savePhotos(id_usuario: number, fotos: any[]) {
      let imagenes = fotos.filter((image) => {
         if (image.includes('data:image/jpeg;base64')) {
            return image;
         } else {
            return;
         }
      });

      this.usuarioService.guardarFotosUsuario(id_usuario, imagenes).subscribe()
   }
}
