import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { RouterModule, Routes } from '@angular/router';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes : Routes = [
  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: NopagefoundComponent},

]


@NgModule({
  imports: [
    RouterModule.forRoot(routes), // Es para rutas principales
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
