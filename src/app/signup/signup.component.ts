import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.auth.usersignedup.subscribe(() => { this.router.navigate(['/']) });
  }

  async signUp(form: NgForm) {
    try {
      const resp = await this.auth.signUp(form.value.name, form.value.email, form.value.password).toPromise();
      alert(resp.user_name + ' registred successfully');
      this.router.navigate(['/']);
    } catch(e){
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
  }
}
