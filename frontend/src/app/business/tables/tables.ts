//
// REEMPLAZA todo tu 'tables.component.ts' con este código
//
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- 1. Importa CommonModule
import { Router } from '@angular/router';       // <-- 2. Importa Router

import { ProductService } from '../../services/product.service';
import { Product } from '../../shared/models/product.model';
import { ProductState } from '../../shared/models/product-state.enum'; // <-- 3. Importa el Enum

@Component({
  selector: 'app-tables',
  standalone: true, // <-- 4. ¡MARCA COMO STANDALONE!
  imports: [
    CommonModule    // <-- 5. AÑADE CommonModule (para *ngIf, *ngFor, etc.)
  ],
  templateUrl: './tables.html',
  styleUrls: ['./tables.scss'] 
})
// 6. USA 'export default' EN LA CLASE DE TU COMPONENTE
export default class TablesComponent implements OnInit {

  public products: Product[] = [];
  public isLoading: boolean = true; 
  public productStates = ProductState; // <-- 7. Expone el Enum al HTML

  // 8. INYECTA EL ROUTER
  constructor(
    private productService: ProductService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        console.log('Productos cargados:', this.products);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.isLoading = false;
      }
    });
  }

  onDelete(id: number): void {
    if (!id) return; 
    
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente');
          this.loadProducts(); 
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
          alert('Hubo un error al eliminar el producto.');
        }
      });
    }
  }

  // 9. RUTAS DE NAVEGACIÓN CORREGIDAS (sin '/business/')
  onEdit(product: Product): void {
    // Como tus rutas son 'tables/edit/:id', la navegación es así:
    this.router.navigate(['/tables/edit', product.id]);
  }

  onCreate(): void {
    this.router.navigate(['/tables/new']);
  }
}

// (Y asegúrate de que no haya ningún otro 'export default' al final del archivo)