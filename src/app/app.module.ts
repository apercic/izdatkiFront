import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { Chart } from 'chart.js';

import { CONST_ROUTING } from './app.routing';

import { AppComponent } from './app.component';
import { GrafiComponent } from './grafi/grafi.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [AppComponent, GrafiComponent, HomeComponent, LoginComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, NgxPaginationModule,  CONST_ROUTING],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
