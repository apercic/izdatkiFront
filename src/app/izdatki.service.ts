import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from "@angular/http";

import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IzdatkiService {

  constructor(private http: HttpClient){}

  public meme = "service dela hura";
  public izdatki = [];
  public prihodki = [];


  servFunc() {

    return this.http.get('http://localhost:8080/get');


  }
}


