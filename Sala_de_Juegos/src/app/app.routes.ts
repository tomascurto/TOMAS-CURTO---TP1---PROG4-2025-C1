import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';
import { LoginComponent } from './pages/login/login.component';
import { AhorcadoComponent } from './juegos/ahorcado/ahorcado.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'quien-soy', component: QuienSoyComponent },
    { path: 'juegos/ahorcado', component: AhorcadoComponent },
    { path: '**', redirectTo: '' }
];
