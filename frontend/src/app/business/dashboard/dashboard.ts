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
  
  // Variable para almacenar productos comprados
  productosComprados: Set<number> = new Set();

  // Productos hardcodeados (ejemplo)
  productosEjemplo = [
    { id: -1, titulo: 'Macbook Pro 14', precio: 850, estado: 'USADO', imagen: 'https://www.notebookcheck.org/fileadmin/Notebooks/Apple/MacBook_Pro_14_2024_M4/IMG_7747.JPG' },
    { id: -2, titulo: 'Smartphone Galaxy Ultra 256GB', precio: 1199, estado: 'NUEVO', imagen: 'https://i.blogs.es/5e1e66/samsung-galaxy-s24-ultra_2274-mejorado-nr/1200_900.jpeg' },
    { id: -3, titulo: 'Consola PS5 Edición Disco + 2 Controles', precio: 450, estado: 'USADO', imagen: 'https://siman.vtexassets.com/arquivos/ids/7269638/consola-ps5-playstation-5-standard-sony-slim-astrobot-gt7-consola-ps5-playstation-5-standard-sony-slim-astrobot-gt7.jpg?v=638932054033170000' },
    { id: -4, titulo: 'Audífonos Pro con Cancelación de Ruido', precio: 220, estado: 'NUEVO', imagen: 'https://diamu.com.bd/wp-content/uploads/2025/08/JBL-Tour-One-M3-Smart-Tx-Over-Ear-Headphones.jpg' },
    { id: -5, titulo: 'Monitor Gamer Curvo 27" 144Hz 1ms', precio: 300, estado: 'USADO', imagen: 'https://master-g.com.bo/wp-content/uploads/2025/06/MGMG2730C-03.png' },
    { id: -6, titulo: 'Tarjeta de Video RTX 3070 8GB', precio: 650, estado: 'USADO', imagen: 'https://virtualbusinesscusco.com/wp-content/uploads/2024/11/TARJETA-GRAFICA-NVIDIA-EVGA-GeForce-RTX-3070Ti-8GB.jpg.webp' },
    { id: -7, titulo: 'Tablet Pro 11" 128GB + Lápiz', precio: 420, estado: 'NUEVO', imagen: 'https://ae01.alicdn.com/kf/Sd7b3abae6c4e47f5a9a01ec234c797430.jpg' },
    { id: -8, titulo: 'Teclado Mecánico Inalámbrico 65%', precio: 110, estado: 'USADO', imagen: 'https://plazavea.vteximg.com.br/arquivos/ids/29093641-418-418/image-d3f3aee1f49f499e954ef4e3e68aa4be.jpg' },
    { id: -9, titulo: 'Drone Mini 2 Fly More Combo', precio: 380, estado: 'USADO', imagen: 'https://modelforce.eu/wp-content/uploads/2022/10/modelforce.eu-osta-droon-dji-mini-2-fly-more-combo-tallinnas-5-scaled.jpg' },
    { id: -10, titulo: 'Smartwatch Series 9 GPS', precio: 299, estado: 'NUEVO', imagen: 'https://m.media-amazon.com/images/I/61wQ31boI-L.jpg' },
  ];

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.cargarProductosComprados();
    this.loadProducts();
  }

  cargarProductosComprados(): void {
    const comprados = localStorage.getItem('productosComprados');
    if (comprados) {
      this.productosComprados = new Set(JSON.parse(comprados));
    }
  }

  estaComprado(productId?: number): boolean { // <--- NUEVO: Método para verificar si un producto está comprado
    if (!productId) return false;
    return this.productosComprados.has(productId);
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

  onPagoExitoso(producto: any): void { // <--- NUEVO: Método para procesar pago exitoso
    if (producto?.id) {
      this.productosComprados.add(producto.id);
      localStorage.setItem('productosComprados', JSON.stringify(Array.from(this.productosComprados)));
    }
  }

  cerrarPasarela(): void { // <--- NUEVO
    this.mostrarPasarela = false;
    this.productoSeleccionado = null;
    // Restaurar scroll
    document.body.style.overflow = 'auto'; 
  }
}

  

