import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
export const AdminGuard: CanActivateFn =(route, state) =>{


  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  /**
   *
   */
  // constructor(private usuarioService: UsuarioService,
  //             private router: Router
  //   ) {
    
  // }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean {
    // if(this.usuarioService.role == 'ADMIN_ROLE')
    if(usuarioService.role == 'ADMIN_ROLE')
      return true;
    else {
      router.navigateByUrl('/dashboard');
      return false;
    }
  // }
  
}
