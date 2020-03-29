import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private router: Router, private auth: AuthService) { }

  // I due parametri vengono passati automaticamente dalla Route,
  // il primo indica il valore della rotta mentre il secondo lo stato
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    if(this.auth.isUserLoggedIn()){
      return true;
    }else{
      // Anche nei servizi e' possibile reindirizzare ad una pagina con il router
      this.router.navigate(['login']);
    }
    
    return false;
  }

  // canActivate() {
  //   return true;
  // }
}
