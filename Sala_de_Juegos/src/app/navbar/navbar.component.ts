import { Component, OnInit, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { UserInterface } from '../user.interface';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  leftItems: MenuItem[] = [];
  rightItems: MenuItem[] = [];
  currentUser: UserInterface | null = null;

  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.updateMenuItems(); 
    });
  }

  updateMenuItems() {
    if (this.currentUser) {
      this.leftItems = [
        { label: 'Home', routerLink: '/home' },
        { label: 'About me', routerLink: '/quien-soy' }
      ];

      this.rightItems = [
        { label: this.currentUser.displayName ?? "Usuario", disabled: true },
        { label: 'Logout', command: () => this.logout() }
      ];
    } else {
      this.leftItems = [
        { label: 'Home', routerLink: '/home' },
        { label: 'About me', routerLink: '/quien-soy' }
      ];

      this.rightItems = [
        { label: 'Sign up', routerLink: '/registro' },
        { label: 'Login', routerLink: '/login' }
      ];
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error al desconectar al usuario', err);
      }
    });
  }
}
