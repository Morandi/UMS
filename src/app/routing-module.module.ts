import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RouteGuardService } from './route-guard.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Implementazione delle rotte per le Single Page Application
// In questo modo e' possibile muoversi tra le sezioni dell'app modificando l'URL
// senza la necessita' di dover ricaricare la pagina
import { Routes, RouterModule } from '@angular/router';
import { UserDataComponent } from './user-data/user-data.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './users/users.component';


// Modulo di configurazione delle rotte privo di vista
// Non e' necessario creare la cartella e il resto della struttura
// Questo tipo di modulo si chiama flat ed e' generato con il comando:
// ng g m <nome-modulo> --flat


// Definizione delle rotte
const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    // canActivate e canActivateChild consentono di proteggere le rotte dell'app
    // alla proprieta' va passato un servizio che implementa l'interfaccia della proprieta'
    // Nel nostro caso dovra' implementare canActivate
    canActivate: [RouteGuardService]
  },
  {
    path: '',
    redirectTo: 'users',
    // Indica che il Path deve conincidere completamente
    pathMatch: 'full',
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/new',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    // I : sono un placeholder che consente di catturare il contenuto di quello specifico campo dell'url
    path: 'users/:id/edit',
    component: UserDetailComponent,
    canActivate: [RouteGuardService]
  },
  {
    path: 'users/:id',
    component: UserDataComponent,
    pathMatch: 'full',
    canActivate: [RouteGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Si deve indicare se vogliamo definire le rotte principali dell'app
    // oppure delle rotte figlie di un'altra rotta
    RouterModule.forRoot(routes)
  ],
  // Dobbiamo esportarlo per fare in modo che possa essere importato in app.module.ts
  exports: [
    RouterModule
  ],
  // Il servizio di protezione delle rotte va inserito nei provider
  providers: [
    RouteGuardService
  ]
})
export class RoutingModuleModule { }
