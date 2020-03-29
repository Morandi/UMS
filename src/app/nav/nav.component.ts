import { User } from './../classes/User';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // Intercetto il click sulla voce di menu New User
  @Output() onNewUser = new EventEmitter();

  isUserLoggedIn = false;
  username: string;

  // constructor(private modalService: NgbModal) { }
  constructor(private auth: AuthService, private router: Router){
    auth.usersignedin.subscribe(
      (user: User) => {
        this.username = user.name;
        this.isUserLoggedIn = true;
      }
    );

    auth.userlogout.subscribe(
      () => {
        this.username = '';
        this.isUserLoggedIn = false;
      }
    )

    auth.usersignedup.subscribe(
      (user : User) => {
        this.username = user.name;
        this.isUserLoggedIn = true;
      }
    )
  };

  ngOnInit(): void {
    this.isUserLoggedIn = this.auth.isUserLoggedIn();
    if(this.isUserLoggedIn){
      const user = this.auth.getUser();
      this.username = user.name;
    }
  }

  newUser(){
    // Emetto l'evento al componente padre che e' AppComponent
    this.onNewUser.emit();
  }

  // Implementazione della chiusura e apertura del menu a mano
  showMenu = true;
  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
  
  // isCollapsed = false;

  logout(e){
    e.preventDefault();
    this.auth.logout();
    this.router.navigate(['login']);
  }

  signIn(e){
    e.preventDefault();
    this.router.navigate(['login']);
  }

  signUp(e){
    e.preventDefault();
    this.router.navigate(['signup']);
  }
}
