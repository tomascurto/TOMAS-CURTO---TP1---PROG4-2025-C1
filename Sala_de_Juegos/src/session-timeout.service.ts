import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private lastActivityTime: number = Date.now();
  private timeoutDuration: number = 15 * 60 * 1000;
  private timeoutTimer: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.setupInactivityListener();
    this.startInactivityTimer();
  }

  private setupInactivityListener() {
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keydown', this.resetTimer.bind(this));
  }

  private resetTimer() {
    this.lastActivityTime = Date.now();
    this.startInactivityTimer();
  }

  private startInactivityTimer() {
    clearTimeout(this.timeoutTimer); 
    this.timeoutTimer = setTimeout(() => {
      this.logoutDueToInactivity();
    }, this.timeoutDuration);
  }

  private logoutDueToInactivity() {
    this.authService.logout().subscribe(() => {
      console.log('Sesión cerrada por inactividad');
      this.router.navigate(['/login']); 
    });
  }
}
