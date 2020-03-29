import { UserService } from './../services/user.service';
import { User } from './../classes/User';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  // Dichiaro la variabile user in Input per poter popolare 
  // i campi della form con quelli dell'utente selezionato 
  // al momento del click sul bottone update.
  // Questa e' una copia dell'oggetto selezionato in tabella
  // @Input() user: User;

  // La soluzione sopra aveva il problema di non consentire il reset della form
  // quando era visualizzato un utente esistente in tabella
  private userCopy: User;
  private _user: User;

  @Input() set user(user: User) {
    this._user = user;
    this.userCopy = Object.assign({}, user)
  }

  get user() {
    return this._user;
  }

  // Indicando un parametro come privato non serve dichiararlo e inizializzarlo

  // ActivatedRoute consente di abbonarsi al servizio che permette di accedere
  // ai parametri definiti nelle rotte (url) come ad esempio l'ID dell'utente.
  // Questo evento viene attivato quando si scrive l'url e si preme invio
  // Le rotte sono state create nel'app.module.
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.user = new User();

    // L'array params e' deprecato, al suo posto possiamo usare la mappa paramMap
    // ed accedere alle proprieta con il metodo get('<nome-parametro>').

    // this.route.params.subscribe(
    this.route.paramMap.subscribe(
      (params) => {
        // if (!params.id) {
        if (!params.get('id')) {
          return;
        }

        // Il segno + consente di fare il cast a number
        // this.userService.getUser(+params.id).subscribe(
        this.userService.getUser(+params.get('id')).subscribe(
          response => this.user = response['data']
        );
      }
    )
  }

  saveUser() {
    // In realta non serve passare l'utente alle due funzioni updateUser e createUser
    // perche' ha visibilita' di classe
    if (this.user.id > 0) {
      this.updateUser(this.user);
    } else {
      this.createUser(this.user);
    }
  }

  updateUser(user: User) {
    this.userService.updateUser(this.user).subscribe(response => {
      if (response['success']) {
        alert('User ' + user.name + ' modificato correttamente');
        this.router.navigate(['users']);
      } else {
        alert(response['message']);
      }
    });
  }

  createUser(user: User) {
    this.userService.createUser(this.user).subscribe(response => {
      if (response['success']) {
        alert('User ' + user.name + ' creato correttamente');
        this.router.navigate(['users']);
      } else {
        alert(response['message']);
      }
    });
  }

  backToUsers() {
    this.router.navigate(['users']);
  }

  resetForm(form) {
    // Se l'id e' 0 significa che ho cliccato sul pulsante New User
    // e posso semplicemente creare l'utente nuovo
    if (this.user.id === 0) {
      this.user = new User();
    } else {
      this.user = this.userCopy;
    }
  }
}
