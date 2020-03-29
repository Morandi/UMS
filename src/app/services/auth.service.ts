import { HttpClient, HttpHeaderResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from './../classes/User';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { tap } from "rxjs/operators";

// Import del file di environment per il deploy dell'app
import { environment } from './../../environments/environment';

// Definisco l'interfaccia Jwt per essere piu' comodo
// a gestire l'oggetto ritornato dalla login
interface Jwt {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

// Per generare un servizio/componente senza file di test 
// basta aggiungere l'opzione --skipTests prima del nome
// Va importato tra i provider del modulo principale app.module.ts
export class AuthService {
  private isUserLogged = false;

  // Emetto degli eventi che possano essere passati alla barra del menu
  // per poter gestire la visibilita' dei bottoni signup, login, logout
  @Output() usersignedin = new EventEmitter<User>();
  @Output() usersignedup = new EventEmitter<User>();
  @Output() userlogout = new EventEmitter();

  // Definisco l'url dell'endpoint da chiamare per avere gli utenti
  // Sposto l'url nel file environment per predisporre l'app al deploy
  // private APIAUTHURL = 'http://localhost:8000/api/auth/';
  private APIAUTHURL = environment.APIAUTH;

  constructor(private http: HttpClient) { }

  isUserLoggedIn() {
    // Simulazione di login. La doppia negazione restituisce un booleano:
    // se la variabile esiste = true altrimenti false
    this.isUserLogged = !!localStorage.getItem('token');
    return this.isUserLogged;
  }

  signIn(email: string, password: string) {
    return this.http.post(this.APIAUTHURL + '/login',
      {
        email: email,
        password: password
      }
      // ).subscribe(

      // Spostiamo la subscribe nel componente in modo da poter gestire gli errori correttamente.
      // Spostiamo infatti la parte di gestione dell'errore nel login.component.ts

      // Il metodo pipe() funziona piu' o meno come un middleware e ci consente di inserire
      // del codice che viene eseguito quando arrivera' la response della chiamata Http.

      // Tap() e' una funzione di rxjs che ci permette di leggere i dati della response
      // senza tuttavia darci la possibilita' di modificarli.
      // Nel nostro caso e' utile per scrivere i dati nella localstorage
    ).pipe(
      tap(
        (payload: Jwt) => {
          // Se tutto va bene dovremmo avere l'access_token
          localStorage.setItem('token', payload.access_token);
          // Viene comodo qualora si debbano prendere i dati direttamente dalla localstorage
          localStorage.setItem('user', JSON.stringify(payload));

          console.log(payload);

          const user = new User();
          user.name = payload.user_name;
          user.email = payload.email;

          // L'evento viene letto dal login component per gestire il redirect all'elenco degli utenti
          this.usersignedin.emit(user);
          return true;
        }
        //,
        // 1. Per avere lo stato
        // (httpResp: HttpHeaderResponse) => {
        // alert(httpResp.statusText);
        // }
        // 2. Per avere il messaggio dell'errore completo
        // (httpResp: HttpErrorResponse) => {
        //   alert(httpResp.message);
        // }
      )
    );
  }

  signUp(username: string, email: string, password: string) {

    const user = new User();
    user.name = username;
    user.email = email;

    return this.http.post(this.APIAUTHURL + '/signup',
      {
        email: email,
        password: password,
        name: username
      }
      // ).subscribe(
    ).pipe(tap(
      (payload: Jwt) => {
        // Se tutto va bene dovremmo avere l'access_token
        localStorage.setItem('token', payload.access_token);
        // Viene comodo qualora si debbano prendere i dati direttamente dalla localstorage
        localStorage.setItem('user', JSON.stringify(payload));

        // L'evento viene letto dal login component per gestire il redirect all'elenco degli utenti
        this.usersignedup.emit(user);
      }
      // ,
      // (httpResp: HttpErrorResponse) => {
      //   alert(httpResp.message);
      // }
    ));
  }

  logout() {
    // Simulazione di logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.userlogout.emit();

    this.isUserLogged = false;
  }

  // Usiamo questa getUser nel componente della barra di navigazione per popolare i campi
  getUser(): User {
    // JSON.parse e' la funzione inversa di JSON.stringify
    // che e' stata usata nel login per salvare i dati nella localStorage
    const data = JSON.parse(localStorage.getItem('user'));
    const user = new User();
    if (data) {
      user.name = data['user_name'];
      user.email = data['email'];
    }

    return user;
  }

  // Lo utilizziamo in tutte le chiamate del servizio UserService
  getToken() {
    return localStorage.getItem('token');
  }
}
