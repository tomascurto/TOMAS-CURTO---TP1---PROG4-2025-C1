import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Usuario o contraseña incorrectos';
      return;
    }

    const rawForm = this.form.getRawValue();

    this.authService.login(
      rawForm.email!,
      rawForm.password!
    ).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage = err.code
    });
  }
}
