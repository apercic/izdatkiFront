import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieStorage, LocalStorage, SessionStorage } from 'ngx-store';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  constructor(private http: HttpClient){}

  ngOnInit() {}

  user = {ime:"", geslo:""};
  status = { errorEInvalid: 0, errorENull: 0, errorPNull: 0,
  errorPrijava:0, successPrijava: 0};

  public login() {
    if(this.user.ime.length < 1) {
      this.status.errorENull = 1;
      return;
    }
    if (this.user.geslo.length < 1) {
      this.status.errorPNull = 1;
      return;
    }

    //---> prestavi v service
    this.http.post('http://localhost:8080/existsUser', {
      "ime":this.user.ime,
      "geslo":this.user.geslo
    }, {responseType: 'text'}).subscribe(data => {
      if (!data) {
        //prijava ni bila neuspešna
        this.status.errorPrijava = 1;
      }
      else {
        //prijava uspešna
        localStorage.setItem('user', this.parseJwt(data).user.ime);
        window.location.href = '/home';
      }

    });
  }

  public parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };


}
