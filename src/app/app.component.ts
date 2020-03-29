import { User } from './classes/User';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UMS';

  // Tipizzazione implicita
  showForm = false;
  userSelected: User = new User();
  
  updateUser(user: User) {
    this.showForm = true;
    this.userSelected = user;
  }

  newUser(){
    this.userSelected = new User();
    this.showForm = true;
  }
}
