import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-card">
      <h1>Iniciar sesión</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Usuario</label>
        <input type="text" formControlName="username" placeholder="admin" />
        <label>Contraseña</label>
        <input type="password" formControlName="password" placeholder="1234" />
        <button type="submit" [disabled]="form.invalid">Entrar</button>
        <p class="error" *ngIf="errorMsg">{{ errorMsg }}</p>
      </form>
    </div>
  `,
  styles: [`
    .login-card { max-width: 360px; margin: 10vh auto; padding: 24px; border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,.08); display: grid; gap: 12px; }
    .login-card h1 { margin: 0 0 8px; }
    .login-card label { font-size: 12px; opacity: .8; }
    .login-card input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 10px; outline: none; }
    .login-card button { margin-top: 8px; padding: 10px 14px; border: 0; border-radius: 10px; cursor: pointer; }
    .login-card .error { color: #c00; margin: 6px 0 0; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  errorMsg = '';
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    const ok = this.auth.login(username!, password!);
    if (ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.errorMsg = 'Credenciales inválidas';
      this.form.patchValue({ password: '' });
    }
  }
}

