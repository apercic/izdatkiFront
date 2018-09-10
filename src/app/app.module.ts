import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { GrafiComponent } from './grafi/grafi.component';

@NgModule({
  declarations: [AppComponent, GrafiComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, NgxPaginationModule,  ChartsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
