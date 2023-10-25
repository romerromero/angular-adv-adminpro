import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu(){
   return this.menu = JSON.parse(localStorage.getItem('menu') || '') || [];
    // console.log('Menu');
    
    // console.log(this.menu);
    
  }
  // menu: any [] = [
  //   {
  //     titulo: "Principal",
  //     icono: "mdi mdi-gauge",
  //     submenu: [
  //       { titulo: "Dashboard", url:"./" },
  //       { titulo: "ProgressBar", url:'./progress' },
  //       { titulo: "Graficas", url:'./grafica1' },
  //       { titulo: "Promesas", url:'./promesas' },
  //       { titulo: "Rxjs", url:'./rxjs' }
  //     ]
  //   },
  //   {
  //     titulo: "Mantenimientos",
  //     icono: "mdi mdi-folder-lock-open",
  //     submenu: [
  //       { titulo: "Usuarios", url:"usuarios" },        
  //       { titulo: "Hospitales", url:"hospitales" },        
  //       { titulo: "Medicos", url:"medicos" },        
  //     ]
  //   }
  // ];

  // constructor() { }
}
