import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { UserInterface } from './user.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sala_de_Juegos';

  authService = inject(AuthService)
  ngOnInit(): void {
    this.authService.user$.subscribe(user =>{
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
        })
      } else {
        this.authService.currentUserSig.set(null);
      }
    })
  }
}
