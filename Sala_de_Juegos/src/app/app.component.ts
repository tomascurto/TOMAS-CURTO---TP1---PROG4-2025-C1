import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { UserInterface } from './user.interface';
import { NavbarComponent } from './navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<app-navbar></app-navbar><router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'Sala_de_Juegos';

  authService = inject(AuthService)
  ngOnInit(): void {
    
  }
}
