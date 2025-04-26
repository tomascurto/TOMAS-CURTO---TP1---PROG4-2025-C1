import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre = '';
  apellido = '';
  edad: number | null = null;
  email = '';
  password = '';
  registerError = '';

  onRegister() {
    // Lógica de registro con Firebase acá
    console.log('Registro de', this.nombre, this.apellido, this.edad, this.email);
  }
}
