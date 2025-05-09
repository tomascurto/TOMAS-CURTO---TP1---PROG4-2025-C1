import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authService.currentUser$.subscribe((user) => {
        const ruta = state.url;

        if (user) {
          if (ruta === '/login' || ruta === '/registro') {
            this.router.navigate(['/']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        } else {
          if (ruta.startsWith('/juegos')) {
            this.router.navigate(['/']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        }
      });
    });
  }
}
