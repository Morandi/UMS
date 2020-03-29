import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { User } from './../classes/User';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Per convenzione il nome del servizio prende il nome del componente al singolare
// Indica ad Angular che il servizio puo' avere delle dipendenze
@Injectable()
export class UserService {

    // Sarebbe stato possibile indicare l'array anche in questo modo:
    // users: User[] = 
    users: Array<User> = [];

    // Definisco l'url dell'endpoint da chiamare per avere gli utenti

    // private APIURL = 'http://localhost:8000/users'
    private APIURL = environment.APIURL;

    constructor(private http: HttpClient, private auth: AuthService) { }

    getAuthHeader(): HttpHeaders {
        const headers = new HttpHeaders(
            {
                Authorization: 'Bearer ' + this.auth.getToken()
            }
        )

        return headers;
    }

    getUsers() {
        // La subscribe viene fatta dal componente che chiama la funzione getUser()
        // users.component.ts

        // Metodi per passare il token
        // 1. Nella url
        // return this.http.get(this.APIURL + '?token=' + this.auth.getToken());
        // 2. Nell'header della chiamata
        return this.http.get(this.APIURL, {
            headers: this.getAuthHeader()
        });

        // Se avessimo lasciato cosi' la risposta non avrebbe restituito dati
        // la get e' una chiamata asincrona e il return sarebbe stato eseguito
        // prima della sua risoluzione
        // return this.http.get(this.APIURL).subscribe(
        //     data => {
        //         console.log(data)
        //     },
        //     error => {
        //         alert(error.message());
        //     }
        // );

        // return this.users;
    }

    getUser(id: number) {
        return this.http.get(this.APIURL + '/' + id, {
            headers: this.getAuthHeader()
        });
    }

    deleteUser(user) {
        // Per lo stesso motivo per cui in modifica abbiamo dovuto passare il metodo put
        const data = { _method: 'DELETE' };
        // In UserController del backend l'id dell'utente da eliminare viene letto
        // dalla route che viene passata.
        return this.http.post(this.APIURL + '/' + user.id, data, {
            headers: this.getAuthHeader()
        });
    }

    // updateUser(user: UserInterface) {
    updateUser(user: User) {
        // Laravel non consente di fare operazioni di UPDATE con il metodo POST,
        // ma accetta solamente PUT o PATCH. Aggiungiamo al payload della request il metodo.
        // Dobbiamo dire a laravel di non sonsiderare il parametro _method come uno dei campi dell'utente
        // Se volessimo potremmo anche usare direttamente:
        // return this.http.put(this.APIURL + '/' + user.id, user);
        // oppure:
        // return this.http.patch(this.APIURL + '/' + user.id, user);

        // Con il metodo POST se si usa Laravel e' possibile che ci sia la necessita'
        // di commentare in Kernel.php il Middleware
        // \App\Http\Middleware\VerifyCsrfToken::class,
        user['_method'] = 'PUT';
        return this.http.post(this.APIURL + '/' + user.id, user, {
            headers: this.getAuthHeader()
        });
    }

    createUser(user: User) {
        return this.http.post(this.APIURL, user, {
            headers: this.getAuthHeader()
        });
    }
}