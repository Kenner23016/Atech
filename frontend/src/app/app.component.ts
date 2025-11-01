import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  show = true;
  loading = false;
  error: string | null = null;
  year = new Date().getFullYear();

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  touched(c: 'username'|'password'){ return this.form.controls[c].touched; }
  invalid(c: 'username'|'password'){ return this.form.controls[c].invalid; }

  onSubmit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true; this.error = null;
    const { username, password } = this.form.getRawValue();

    // Si tu AuthService es síncrono, adapta esto; aquí asumo Observable
    this.auth.login(username, password).subscribe({
      next: () => { this.loading = false; this.router.navigateByUrl('/dashboard'); },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = (typeof err?.error === 'string' && err.error) || 'Credenciales inválidas';
      }
    });
  }
}
