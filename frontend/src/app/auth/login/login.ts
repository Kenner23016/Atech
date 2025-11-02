import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'] // <-- plural
})
export default class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = false;
  isSubmitting = false;
  errorMsg = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    remember: [true]
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  togglePassword() { this.showPassword = !this.showPassword; }

  onSubmit() {
    if (this.loginForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMsg = '';

    // Lee valores sin nulls y normaliza
    const { email, password, remember } = this.loginForm.getRawValue();
    const e = (email ?? '').toLowerCase().trim();
    const p = (password ?? '').trim();

    // Simulado (sin token)
    const VALID: Record<string, string> = {
      'admin@atech.com': 'admin123',
      'user@atech.com': '123456'
    };

    // Simula latencia
    setTimeout(() => {
      const ok = VALID[e] === p;
      if (ok) {
        (remember ? localStorage : sessionStorage).setItem('isAuth', 'true');
        this.router.navigateByUrl('/dashboard');
      } else {
        this.errorMsg = 'Credenciales inválidas. Intenta de nuevo.';
      }
      this.isSubmitting = false;
    }, 400);
  }
}
