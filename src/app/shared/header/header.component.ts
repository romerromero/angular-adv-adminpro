import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit{

  public usuario : Usuario;

  constructor( private usuarioService: UsuarioService,
               private router : Router
    ) { 
    // this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;
  }
  ngOnInit(): void {
    
  }
  
  logout(){
    this.usuarioService.logout();
  }

  buscar(termino: string){
    if(termino.length === 0){
      return;
    }
    
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }

}
