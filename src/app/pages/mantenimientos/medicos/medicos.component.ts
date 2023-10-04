import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  // styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando: boolean  = false;

  private $imgSubs: Subscription = new Subscription;

  /**
   *
   */
  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService
    ) {
    
    
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.$imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe(img =>{
      this.cargarMedicos();
    });
  }

  ngOnDestroy(): void {
    this.$imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe({
          next: medicos =>{                         
            this.medicos = medicos;
            this.medicosTemp = medicos;
            this.cargando = false;
          }
        })
  }

    
  abrirModal(medico: Medico){    
    this.modalImagenService.abrirModal('medicos', medico._id!, medico.img);
  }

  buscar(termino: string){

    console.log(termino);
    
    if(termino.length === 0){
      this.medicos = this.medicosTemp;       
      return;
    }

    this.busquedaService.buscar('medicos', termino).subscribe({
      next: resultados =>{
        this.medicos = resultados as Medico[];
      }
    })
    
  }

  eliminarMedico(medico: Medico){

    return Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,      
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
       this.medicoService.eliminarMedico(medico._id!)
           .subscribe(
            {
              next: resp =>{
              this.cargarMedicos();
              Swal.fire(
                'Médico borrado',
                `${medico.nombre} fue eliminado correctamente`,
                'success'
               )
            }
           });
      }
    })
  }

}
