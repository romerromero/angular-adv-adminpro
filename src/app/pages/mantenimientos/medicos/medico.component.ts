import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  // styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  medicoForm: FormGroup;
  hospitales : Hospital[] = [];
  hospitalSeleccionado: Hospital | undefined;
  medicoSeleccionado: Medico | undefined;

  constructor(private fb: FormBuilder,
              private hospitalService : HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activateRoute: ActivatedRoute
    ) {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.activateRoute.params
        .subscribe( ({id}) => this.cargarMedico(id) );

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
        .subscribe(hospitalId =>{
          this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
          console.log(this.hospitalSeleccionado);
        })
  }

  cargarMedico(id: string){
    if(id === 'nuevo')
      return;

    this.medicoService.obtenerMedicoById(id)
        .pipe(
          delay(100)
        )
        .subscribe({
            next: (medico) =>{
              this.medicoSeleccionado = medico;    
              const { nombre, hospital: {_id} } = medico;
              this.medicoForm.setValue({ nombre, hospital: _id });
            }, error: () =>{
              this.router.navigateByUrl(`/dashboard/medicos`);
            }
        });
  }

  guardarMedico(){
    const { nombre } =  this.medicoForm.value;

    if(this.medicoSeleccionado){
      // actualizar
      const data = { // desectructuramos el formulario 
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico(data)
          .subscribe({
            next:resp =>{
              Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success' );
            }
          })
    } else {
      // crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe({
          next: (resp: any) =>{       
            console.log(resp);
                 
            Swal.fire('Creado', `${nombre} creado correctamente`, 'success' );
            this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
          }
        });
    }

    
  }

  cargarHospitales(){

    this.hospitalService.cargarHospitales()
        .subscribe({
          next: (hospitales: Hospital[]) =>{
            this.hospitales = hospitales;                 
          }
        })
  }

  // obtenerMedicoById(id: string){
  //   this.medicoService.crearMedico(this.medicoForm.value)
  //   .subscribe({
  //     next: (resp: any) =>{       
  //       console.log(resp);
             
  //       Swal.fire('Creado', `${nombre} creado correctamente`, 'success' );
  //       this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
  //     }
  //   })
  // }

}
