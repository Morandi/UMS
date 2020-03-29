import { UserService } from './../services/user.service';
import { User } from './../classes/User';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})

export class UserDataComponent implements OnInit {
  public user: User;
  public title = 'User Detail';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (p) => {
        this.userService.getUser(+p.get('id')).subscribe(
          response => this.user = response['data']
        )
        
        // Cast obbligatorio perche' nella funzione getUser c'e' l'uguaglianza con ===
        // che veridica che anche il tipo del valore passato sia lo stesso
        // this.user = this.userService.getUser(+p.id)
      }
    );
  }



  backToUsers(){
    this.router.navigate(['users']);
  }
}
