import { Routes, RouterModule } from '@angular/router';
import {GrafiComponent} from "./grafi/grafi.component";
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";



const MAINMENU_ROUTES: Routes = [
  { path: 'grafi', component: GrafiComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];
export const CONST_ROUTING = RouterModule.forRoot(MAINMENU_ROUTES);
