import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, CanMatchFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

export const canMatch: CanMatchFn = () =>{

  const router = inject(Router);

    return inject(UsuarioService).validarToken()
            .pipe(
              tap( estaAutenticado => {
                if(!estaAutenticado){                  
                  router.navigateByUrl('/login');
                }
              })
            )
// }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  // constructor(private usuarioService: UsuarioService,
  //             private router: Router
  //   ) {
    
  // }

    const usuarioService = inject(UsuarioService);
    const router = inject(Router);

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot) {  
              
      // return this.usuarioService.validarToken()
      return usuarioService.validarToken()
              .pipe(
                tap( estaAutenticado => {
                  if(!estaAutenticado){
                    // this.router.navigateByUrl('/login');
                    router.navigateByUrl('/login');
                  }
                })
              )
// }
  
}
