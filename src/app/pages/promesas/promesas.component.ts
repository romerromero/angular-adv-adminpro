import { Component } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent {
  constructor() {}
  ngOnInit(): void {

    this.getUsuarios().then(usuario =>{
      console.log(usuario);
      
    })
  //   const promesa = new Promise( (resolve, reject) => {
  //     if(false){
  //       resolve('Hola mundo');
  //     } else {
  //       reject('Algo salio mal');
  //     }
  //   });

  //   promesa.then( (mensaje) => {
  //     console.log(mensaje);
  //   })
  //   .catch(error => console.log('Error en mi promesa', error));
    

  //   console.log('fin de la promesa');
    
    
  }

  getUsuarios(){

    const promesa = new Promise(resolve => {  
        fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then( body => resolve(body.data));      
      });
    return promesa
  }
}
