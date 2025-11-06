import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthRedirectGuard } from './guards/authredirect.guard';
import { LoginFailedComponent } from './login-failed/login-failed.component';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthRedirectGuard] },
  { path: 'login-failed', component: LoginFailedComponent },
];

