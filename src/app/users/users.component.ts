import { User } from './../classes/User';
import { UserService } from '../services/user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Il decorator è una funzione che aggiunge delle cose ad una classe normale
@Component({
    selector: 'app-users',
    // Template inline
    // template: '<h2>Users</h2>'
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']

})
export class UsersComponent implements OnInit {
    title = 'Users'
    users: User[] = [];

    // Prende l'utente passato da user-component e lo rilancia in output ad app-component dopo il click sul bottone UPDATE
    // E' possibile dire che tipo di parametro passiamo all'EventEmitter in questo caso User
    @Output() updateUser = new EventEmitter<User>();

    // E' buona norma passare i servizi direttamente al costruttore del componente
    // A questo punto in app.module.ts il servizio va inserito tra i provider
    // Cio' consente anche di instanziare il servizio come Singleton
    // Questo si chiama DEPENDENCIES INJECTION e per questo motivo è opportuno
    // aggiungere il decoratore @Injectable(); prima della definizione della classe del servizio
    constructor(private service: UserService) {
    }

    // HOOK che viene chiamato appena si instanzia una classe.
    // In angular e' un'interfaccia che deve essere implementata e
    // della quale si deve fare l'override del metodo
    ngOnInit() {
        this.service.getUsers().subscribe(
            // Fino ad Angular4 response.data poi response['data']
            response => this.users = response['data']
        );
    }

    onDeleteUser(user: User) {
        const deleteUser = confirm('Do you really want to delete user ' + user.name + ' ' + user.lastname + '?');
        if(deleteUser){
            this.service.deleteUser(user).subscribe(
                response => {
                    // L'utente ora e' stato eliminato dal DB, ma non dall'array del DOM.
                    // Per aggiornare la tabella e' possibile ricaricare i dati chiamando la getUsers()
                    // oppure eliminare l'utente selezionato dall'array users
                    const idx = this.users.indexOf(user);
                    this.users.splice(idx, 1);
                    alert(response['message']);
                }
            );
        }
    }

    onSelectUser(user: User) {
        // alert(user.lastname);
        // Di default gli oggetti in JS vengono sempre passati per riferimento
        // In questo caso alla form vogliamo passare una copia dell'oggetto 
        // in modo che i dati in tabella vengano modificati solamente quando 
        // l'utente preme sul bottone salva. 
        // Si puo' creare una copia dell'oggetto con la funzione assign di Object
        const userCopy = Object.assign({}, user);
        this.updateUser.emit(userCopy);
    }
}