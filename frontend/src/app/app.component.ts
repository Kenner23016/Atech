import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Used Marketplace</h1><p>{{ msg }}</p>`
})
export class AppComponent {
  private http = inject(HttpClient);
  msg = 'Cargando...';
  ngOnInit() {
    this.http.get('/api/hello', { responseType: 'text' })
      .subscribe({
        next: v => this.msg = v,
        error: _ => this.msg = 'Backend no disponible'
      });
  }
}

