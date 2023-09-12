import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp : any = null;

  constructor( private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
    
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    })
  }

  actualizarPerfil (){
    console.log(this.perfilForm?.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
        .subscribe(
        {
          next: resp =>{
            const { nombre, email } = this.perfilForm.value;
            this.usuario.nombre = nombre;
            this.usuario.email = email;
  
            Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
          }, error:(err)=>{
          console.log(err.error.msg);
          Swal.fire('Error', err.error.msg, 'error');
          
          }
        }
        );
    
  }

  // cambiarImagen(event: any){
  cambiarImagen(file: File){         
    // let nombreFile = file.name;   
    debugger
    if(!file){
      this.imgTemp = null;

      return;
    }
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];    
    if(!extensionesValidas.includes(file.name.split('.').pop()!)){      
      this.imgTemp = null;
      
      Swal.fire('Error', `El fichero no contiene una extension valida (${ extensionesValidas })`, 'error');
      return ;
    }
    
    this.imagenSubir = file;    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = () =>{     
      this.imgTemp  = reader.result;      
      
    }
  }

  subirImagen(){
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then( img =>{
        this.usuario.img = img 
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      }).catch( err => {
        console.log(err);
        
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');       
      });      
  }

}