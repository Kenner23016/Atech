import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit {
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

  // Método para el botón "+ Nuevo Producto" que ya tenías
  irACrearProducto(): void {
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
      // Volvemos a cargar los productos después de eliminar
      next: () => this.loadProducts(), 
      error: (err: unknown) => console.error('Error eliminando producto', err)
    });
  }
}

  

