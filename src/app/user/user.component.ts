import { User } from './../classes/User';
import { UserService } from '../services/user.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Per comodita' importo tutto il pacchetto, ma potrei 
// importare solamente le icone che mi servono nel componente
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  // Quando una variabile viene passata dall'esterno ad esempio un componente padre
  // si può dichiarare qui impostando il nome della variabile visto dal componente
  // e l'alias della variabile visibile dagli altri componenti esterni
  // inputs:['user:user-data'],
  
  // Il browser vede i componenti come elementi di tipo 'blocco' (div, p, table...)
  // Per dire che è un elemento di un 'blocco' html come ad esempio una riga si indica
  // il nome dell'elemento e tra [] il nome del component
  selector: 'tr[app-user]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

// Per creare un componente da riga di comando: ng generate component <nome_componente>
// oppure ng g c <nome_componente>
export class UserComponent implements OnInit {
  // devo metterlo nel costruttore per passarlo alla grafica
  fas = fas;
  
  // Volendo una variabile di tipo input si puo' essere dichiarata anche con il decoratore @Input
  // Non e' obbligatorio, ma si può definire il tipo della variabile
  @Input('user-data') user: User;
  
  @Output('onDeleteUser') onDeleteUser = new EventEmitter;
  @Output() onSelectUser = new EventEmitter;

  // E' possibile accedere al service direttamente da un componente figlio
  // con la dependencies injection
  // constructor(private service : UserService) { }

  // ActivaderRoute viene lanciato quando si attiva una rotta
  // Router consente di navigare tra le rotte: per passarle all'url.
  constructor(private route: Router){}

  ngOnInit(): void {
  }

  deleteUser(){
    // Non e' necessario passare la variabile user perche' ce l'abbiamo gia'
    // e' sufficiente richiamarla con this
    // alert(this.user.lastname);

    // Cancellazione dell'utente dal component user con l'injection del servizio
    // this.service.deleteUser(this.user);
    
    // Cancellazione demandata al componente padre Users
    this.onDeleteUser.emit(this.user);
  }

  updateUser(){
    this.route.navigate(['users', this.user.id, 'edit']);
    this.onSelectUser.emit(this.user);
  }

  showUserDetail(){
    this.route.navigate(['users', this.user.id]);
  }
}
