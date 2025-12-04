import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../services/product.service';
import { PaymentGatewayComponent } from '../../components/payment-gateway/payment-gateway'; // <--- NUEVO

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. LO AGREGAMOS AL ARRAY DE IMPORTS
  imports: [CommonModule, RouterModule, CurrencyPipe, PaymentGatewayComponent], // <--- NUEVO: Agregado PaymentGatewayComponent
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit {
  products: Product[] = [];
  loading = false;

  // 3. VARIABLES PARA EL MODAL DE PAGO
  mostrarPasarela: boolean = false; // <--- NUEVO
  productoSeleccionado: any = null; // <--- NUEVO (Usamos 'any' para aceptar tanto productos reales como los hardcoded)

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
      next: () => this.loadProducts(),
      error: (err: unknown) => console.error('Error eliminando producto', err)
    });
  }

  // 4. MÉTODOS PARA CONTROLAR LA PASARELA (Copiar esto al final de la clase)
  
  abrirPasarela(producto: any): void { // <--- NUEVO
    console.log('Abriendo pasarela para:', producto);
    this.productoSeleccionado = producto;
    this.mostrarPasarela = true;
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden'; 
  }

  cerrarPasarela(): void { // <--- NUEVO
    this.mostrarPasarela = false;
    this.productoSeleccionado = null;
    // Restaurar scroll
    document.body.style.overflow = 'auto'; 
  }
}

  

