import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SessionTimeoutService } from '../session-timeout.service';
import { UserInterface } from './user.interface';


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

  router = inject(Router);


  constructor() {}
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: UserInterface | null) => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
