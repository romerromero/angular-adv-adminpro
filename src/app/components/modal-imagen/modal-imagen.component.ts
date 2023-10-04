import { Component } from '@angular/core';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent {

  /**
   *
   */

  public imagenSubir!: File;
  public imgTemp : any = null;

  @ViewChild('inputFile') inputFile: any;

  // ponemos public el modalImagenService porque lo utilizaremos en el html
  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService
    ) {}    
      
  clearForm(){
    this.inputFile.nativeElement.value = '';
  }

  cerrarModal(){
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
    this.clearForm();
  }

  cambiarImagen(file: File){         
    // let nombreFile = file.name;       
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

    const id   = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then( img =>{
        Swal.fire('Guardado', 'Imagen actualizada', 'success');

        // Emision de un servicio
        this.modalImagenService.nuevaImagen.emit(img);  

        this.cerrarModal();  
      }).catch( err => {
        console.log(err);
        
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');       
      });      
  }
}
