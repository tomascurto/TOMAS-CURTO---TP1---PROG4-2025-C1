import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    const ruta = state.url;

    if (user) {
      if (ruta === '/login' || ruta === '/registro') {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (ruta.startsWith('/juegos')) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
  }
}
