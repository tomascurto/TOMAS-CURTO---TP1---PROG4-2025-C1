import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string | null = null;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],       // se usará como displayName
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    age: ['', Validators.required]
  });

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Completá todos los campos correctamente';
      return;
    }

    const rawForm = this.form.getRawValue();

    this.authService.register(
      rawForm.email!,
      rawForm.name!, // 👈 nombre que va como displayName
      rawForm.password!,
      {
        lastName: rawForm.lastName!,
        age: rawForm.age!
      }
    ).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage = err.code
    });
  }
}
