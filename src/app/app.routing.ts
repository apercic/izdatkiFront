import { Routes, RouterModule } from '@angular/router';
import {GrafiComponent} from "./grafi/grafi.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";


const MAINMENU_ROUTES: Routes = [
  //full : makes sure the path is absolute path
  { path: 'grafi', component: GrafiComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent }

];
export const CONST_ROUTING = RouterModule.forRoot(MAINMENU_ROUTES);
