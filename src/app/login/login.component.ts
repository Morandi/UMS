import { User } from './../classes/User';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// ng g c --skipTests login --module=app.module
// Ho dovuto indicare il modulo in cui includere il componente
// perche' al momento della creazione nella root c'erano due moduli
// app.module e routing-module e Angular a priori non puo' sapere dove metterlo
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async signIn(form: NgForm) {
    if (!form.valid) {
      return false;
    }

    // Metodo con le promise (async - await)
    // Trasformiamo da Observable a promise
    try {
      const resp = await this.auth.signIn(form.value.email, form.value.password).toPromise();
      alert(resp.user_name + ' logged in successfully');
      this.router.navigate(['']);
    } catch (e) {
      switch (e.status) {
        case 401:
          alert(e.error.error);
          break;
        case 404:
          alert(e.statusText);
          break;
        case 500:
          alert('Error contacting server');
          break;
      }
    }


    // Metodo con subscribe
    /*
    this.auth.signIn(form.value.email, form.value.password).subscribe(
        (payload: Jwt) => {
          alert('Utente loggato correttamente');
          this.router.navigate(['']);
        },
        // Le parentesi graffe si usano per destrutturare gli oggetti.
        // La risposta e' un'oggetto che contiene a sua volta l'oggetto error
        // all'interno del quale c'e' il messaggio d'errore.
        // Con la destrutturazione dell'oggetto diciamo di voler accedere all'oggetto error della risposta
        ({ error }) => {
          alert(error.error);
        }
      );
    // Questo metodo non va piu' bene perche' il login fa una chiamata asincrona al server
    // e la funzione ritorna prima del risultato. Adesso e' gestito nel costruttore
    // let result = this.auth.signIn(form.value.email, form.value.password);
    // if(result){
    //   this.router.navigate(['']);
    // }
    */
  }

}
