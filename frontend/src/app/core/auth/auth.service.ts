import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 👇 Cambia estas credenciales a lo que quieras
  private readonly USER = 'admin';
  private readonly PASS = '1234';

  private _logged = signal<boolean>(localStorage.getItem('isAuth') === 'true');
  readonly isLogged = computed(() => this._logged());

  isAuthenticated(): boolean {
    return this._logged();
  }

  login(user: string, pass: string): boolean {
    const ok = user === this.USER && pass === this.PASS;
    if (ok) {
      localStorage.setItem('isAuth', 'true');
      this._logged.set(true);
    }
    return ok;
  }

  logout(): void {
    localStorage.removeItem('isAuth');
    this._logged.set(false);
  }
}
