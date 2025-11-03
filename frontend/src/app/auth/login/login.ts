import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // UI
  showPassword = false;
  isSubmitting = false;
  errorMsg = '';

  // en tu backend el usuario es "demo" (sin @)
  // por eso aquí NO pongo Validators.email, solo required
  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  ngOnInit(): void {
    // si YA hay sesión, no muestres el login
    this.http.get('/api/auth/me').subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => {
        // no pasa nada, el user no está logueado
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';
    const remember = this.loginForm.value.remember ?? false;

    this.isSubmitting = true;
    this.errorMsg = '';

    // Spring Security (con formLogin) espera EXACTAMENTE esto:
    // Content-Type: application/x-www-form-urlencoded
    // body: username=<user>&password=<pass>
    const body = new HttpParams()
      .set('username', email) // mapeamos tu "email" al username de Spring
      .set('password', password);

    this.http
      .post('/login', body.toString(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        // por si lo corres sin proxy o con mismo puerto
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        // si el login salió bien, confirmamos con el endpoint que ya tenías
        // GET /api/auth/me  -> 200 si hay sesión
        switchMap(() =>
          this.http.get<{ username: string }>('/api/auth/me', {
            withCredentials: true,
          }),
        ),
        catchError((err) => {
          console.error('Error en login', err);
          this.errorMsg = 'Credenciales inválidas o el servidor no respondió.';
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe((me) => {
        if (!me) {
          // hubo error y ya mostramos el mensaje arriba
          return;
        }

        // guardar banderita simple
        if (remember) {
          localStorage.setItem('isAuth', 'true');
        } else {
          sessionStorage.setItem('isAuth', 'true');
        }

        // si venía de una ruta protegida, el guard la manda como returnUrl
        const qpReturn = this.route.snapshot.queryParamMap.get('returnUrl');

        // 👇 aquí está el truco para que NO te regrese al login
        const returnUrl =
          !qpReturn || qpReturn === '/login' ? '/dashboard' : qpReturn;

        this.router.navigateByUrl(returnUrl);
      });
  }
}

