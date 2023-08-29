import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginForm } from '../interfaces/login-form.interface';


declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone
    ) {}

  logout(){

    const email = localStorage.getItem('email') || '';    
    
    google.accounts.id.revoke(email, () => {
      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    });
  }

  validarToken(): Observable<boolean>{
    const token  = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      headers:{
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) =>{
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true),
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

  login(formData: LoginForm){
      return this.http.post(`${ base_url }/login`, formData)
                  .pipe(
                    map( (resp: any) =>{                  
                      localStorage.setItem('token', resp.token);                                                               
                    })
                  )
  }

  loginGoogle( token: string ) {
    // debugger
    return this.http.post(`${ base_url }/login/google`, {token})
                .pipe(
                  map( (resp: any) =>{                    
                    localStorage.setItem('token', resp.token);
                    localStorage.setItem('email', resp.email);
                    console.log(resp);   
                  })
                )
  }


}
