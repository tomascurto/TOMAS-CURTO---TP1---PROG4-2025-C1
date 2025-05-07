import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';
import { LoginComponent } from './pages/login/login.component';
import { AhorcadoComponent } from './juegos/ahorcado/ahorcado.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'registro', component: RegistroComponent, canActivate: [AuthGuard] },
    { path: 'quien-soy', component: QuienSoyComponent },
    { path: 'juegos/ahorcado', component: AhorcadoComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];
