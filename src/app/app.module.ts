import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { Chart } from 'chart.js';
import { WebStorageModule } from 'ngx-store';

import { CONST_ROUTING } from './app.routing';

import { AppComponent } from './app.component';
import { GrafiComponent } from './grafi/grafi.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [AppComponent, GrafiComponent, HomeComponent, LoginComponent, SignupComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, NgxPaginationModule,
   CONST_ROUTING, WebStorageModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
