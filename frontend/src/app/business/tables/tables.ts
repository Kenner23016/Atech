import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './tables.html'
})
export default class TablesComponent implements OnInit {

  products: Product[] = [];
  loading = false;

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando productos', err);
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    this.router.navigate(['/tables/new']);
  }

  onEdit(product: Product): void {
    this.router.navigate(['/tables/edit', product.id]);
  }

  onDelete(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) {
      return;
    }
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err: unknown) => console.error('Error eliminando producto', err)
    });
  }
}
