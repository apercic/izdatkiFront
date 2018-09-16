import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorage, SharedStorage } from 'ngx-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient){}


  user = {"ime":""};
  logedin = 0;

  ngOnInit(): void {
    var bb = localStorage.getItem('user');
    this.user.ime = bb;
    if (bb != null) this.logedin = 1;
    else this.logedin = 0;
  }

  public signout() {
    localStorage.removeItem('user');
    this.user.ime = "";
    this.logedin = 0;
    window.location.href = '/';
  }


}
