import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuario : number = 0;
  public usuarios : Usuario[]  = [];
  public usuariosTemp : Usuario[]  = [];
  public desde: number = 0;
  public cargando: boolean = false;
  public imagenSubir!: File;

  public $imgSubs: Subscription = new Subscription;

  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService,
              private fileUploadService: FileUploadService
    ){

  }
  ngOnDestroy(): void {
     this.$imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuario();    
    
    this.$imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe( img => {
      console.log(img);
      
      this.cargarUsuario()
    });
  }


  cargarUsuario(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe({
      next: ({ total, usuarios}) =>{
          this.totalUsuario  = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.cargando = false;
      }
    })
  }

  cambiarPagina(valor: number){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    } else if( this.desde >= this.totalUsuario) {
      this.desde -= valor;
    }

    this.cargarUsuario();
  }

  buscar(termino: string){

    console.log(termino);
    
    if(termino.length === 0){
      this.usuarios = this.usuariosTemp;       
      return;
    }

    this.busquedaService.buscar('usuarios', termino).subscribe({
      next: resultados =>{
        this.usuarios = resultados;
      }
    })
    
  }

  eliminarUsuario(usuario: Usuario){
      
    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error!','No puede borrarse a si mismo', 'error');
    }

    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,      
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
       this.usuarioService.eliminarUsuario(usuario)
           .subscribe(
            {
              next: resp =>{
              this.cargarUsuario();
              Swal.fire(
                'Usuario borrado',
                `${usuario.nombre} fue eliminado correctamente`,
                'success'
               )
            }
           });
      }
    })
    
  }

  cambiarRole(usuario: Usuario){
     this.usuarioService.guardarUsuario(usuario)
         .subscribe({
          next: resp =>{
            console.log(resp);            
          }
         })
    
  }

  abrirModal(usuario: Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid!, usuario.img);
  }

  cambiarImagen(){
    

    this.fileUploadService.actualizarFoto(this.imagenSubir ,'usuarios', '123456')
    .then( img =>{
      // this.usuario.img = img 
      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
    }).catch( err => {
      console.log(err);
      
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');       
    });     
  }



}
