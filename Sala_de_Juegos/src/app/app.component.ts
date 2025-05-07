import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SessionTimeoutService } from '../session-timeout.service';

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

  sessionTimeoutService = inject(SessionTimeoutService);

  constructor() {}
  ngOnInit(): void {
  }
}
