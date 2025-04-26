import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = '';

  onLogin() {
    // Lógica de login con Firebase acá
    console.log('Login con', this.email, this.password);
  }

  quickLogin(email: string) {
    const fakePassword = '123456'; // Cambiar según tus usuarios de prueba
    this.email = email;
    this.password = fakePassword;
    this.onLogin();
  }
}
