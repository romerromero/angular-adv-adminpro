import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public hospitales: Hospital[] = [];
  public hospitalesTemp : Hospital[] = [];
  public cargando : boolean = false;
  
  private $imgSubs: Subscription = new Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService
    ) {
    
  }
  ngOnInit(): void {
    this.cargarHospitales();

    this.$imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe( img => {      
      
      this.cargarHospitales()
    });
  }

  ngOnDestroy(): void {
    this.$imgSubs.unsubscribe();
 }

  cargarHospitales (){
    this.cargando = true;
    this.hospitalService.cargarHospitales()
    .subscribe({
      next: hospitales =>{
        this.cargando = false;
        this.hospitales = hospitales;      
        this.hospitalesTemp = hospitales;          
      }
    })
  }

  guardarCambios(hospital: Hospital){
    
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
    
    .subscribe({
      next: resp => {
            Swal.fire('Actualizado', hospital.nombre, 'success');
          }
        });
    
  }

  eliminarHospital(hospital:Hospital){
    this.hospitalService.eliminarHospital(hospital._id!)    
    .subscribe({
      next: resp => {
          this.cargarHospitales();
            Swal.fire('Borrado', hospital.nombre, 'success');
          }
        });
    
  }

  async abrirSweetAlert (){
    const { value = '' } = await Swal.fire<string>({      
      title:'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',      
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
      confirmButtonText:'Confirmar',
      cancelButtonText:'Cancelar'
    })

    if(value!.trim().length > 0){
      this.hospitalService.crearHospital(value!)
        .subscribe({
          next: (resp: any) =>{
            Swal.fire('Agregado', value, 'success');
            this.hospitales.push(resp.hospital);
            
          }
        })
    }
    
    
        
  }

  
  abrirModal(hospital: Hospital){    
    this.modalImagenService.abrirModal('hospitales', hospital._id!, hospital.img);
  }

  buscar(termino: string){

    console.log(termino);
    
    if(termino.length === 0){
      this.hospitales = this.hospitalesTemp;       
      return;
    }

    this.busquedaService.buscar('hospitales', termino).subscribe({
      next: resultados =>{
        this.hospitales = resultados as Hospital[];
      }
    })
    
  }


}
