import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SessionTimeoutService } from '../session-timeout.service';
import { UserInterface } from './user.interface';
import { ChatComponent } from './componentes/chat/chat.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<app-navbar></app-navbar><router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'Sala_de_Juegos';

  authService = inject(AuthService)

  sessionTimeoutService = inject(SessionTimeoutService);
  user: UserInterface | null = null;
  router = inject(Router);
  isChatVisible = false;
  isChatOpen = false;
  buttonState: 'left' | 'right' = 'right';

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  
    this.buttonState = this.buttonState === 'right' ? 'left' : 'right';
    
  }

  constructor() {}
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: UserInterface | null) => {this.user = user});
    if (this.user) {
      this.router.navigate(['/home']);
      this.isChatVisible = true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
