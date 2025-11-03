import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export default class Profile {
  private http = inject(HttpClient);
  private router = inject(Router);

  // este lo vamos a llamar desde el HTML
  logout(event?: Event) {
    // para que el <a href="#"> no recargue la página
    event?.preventDefault();

    // 1) avisar al backend que cierre la sesión (Spring /logout)
    this.http
      .post('/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => this.finishLogout(),
        error: () => this.finishLogout(), // aunque falle, limpiamos del lado del cliente
      });
  }

  private finishLogout() {
    // 2) limpiar lo que guardamos cuando hicimos login
    localStorage.removeItem('isAuth');
    sessionStorage.removeItem('isAuth');

    // 3) mandar al login
    this.router.navigate(['/login']);
  }
}

