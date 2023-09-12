import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';


declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {  
  
  public usuario!: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone
    ) {}

  logout(){    
    const email = localStorage.getItem('email') || '';    
    if(email != ''){
      google.accounts.id.revoke(email, () => {
        this.ngZone.run(() =>{
          this.router.navigateByUrl('/login');
        });
        localStorage.removeItem('email');
      });
    }  else 
      this.router.navigateByUrl('/login');
    localStorage.removeItem('token');

  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(){
    return  {
      headers:{
      'x-token': this.token
      }
    }
  }

  validarToken(): Observable<boolean>{    

    return this.http.get(`${base_url}/login/renew`, {
      headers:{
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) =>{
        console.log(resp);                
        const { email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid)        
        return true;
      }),      
      catchError( error => of(false))
    )
  }

  crearUsuario(formData: RegisterForm){
      return this.http.post(`${ base_url }/usuarios`, formData)
              .pipe(
                map( (resp: any) =>{                  
                  localStorage.setItem('token', resp.token);
                })
              )
  }

  actualizarPerfil(data: { email: string, nombre: string, role?: string }){
      data = {
        ...data,
        role: this.usuario.role
      };

    return this.http.put(`${ base_url }/usuarios/${this.uid}`, data, this.headers)       
  }

  login(formData: LoginForm){
      return this.http.post(`${ base_url }/login`, formData)
                  .pipe(
                    map( (resp: any) =>{                  
                      localStorage.setItem('token', resp.token);                                                               
                    })
                  )
  }

  loginGoogle( token: string ) {    
    return this.http.post(`${ base_url }/login/google`, {token})
                .pipe(
                  map( (resp: any) =>{                    
                    localStorage.setItem('token', resp.token);
                    localStorage.setItem('email', resp.email);
                    console.log(resp);   
                  })
                )
  }

  cargarUsuarios(desde: number = 0){
    // http://localhost:3000/api/usuarios?desde=0

    const url = `${base_url}/usuarios/?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
              .pipe(
                map( resp =>{                  
                  const usuarios = resp.usuarios.map(
                    user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                  );

                  return {
                    total: resp.total,
                    usuarios
                  };
                })
              )
  }

  eliminarUsuario(usuario: Usuario){
    // http://localhost:3000/api/usuarios/64b5083923493a24deeb4a75
    
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario){
    return this.http.put(`${ base_url }/usuarios/${usuario.uid}`, usuario, this.headers)       
  }
  
}
