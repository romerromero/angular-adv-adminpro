import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard, canMatch } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';

const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        canMatch: [ canMatch ], // si trabajo con lazinloading tengo que poner el canLoad 
        // children:[
         
        // ]
        loadChildren:() => import('./child-routes.module').then(m => m.ChildRoutesModule)
      },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
