import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product, ProductState } from '../../../shared/models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html'
})
export default class ProductFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    estado: ['NUEVO', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    imagen: ['', [Validators.required, Validators.maxLength(255)]]
  });

  isEdit = false;
  productId?: number;
  loading = false;
  saving = false;
  errorMsg = '';

  // opciones del enum
  estados = [
    { value: ProductState.NUEVO, label: 'Nuevo' },
    { value: ProductState.USADO, label: 'Usado' }
  ];

  ngOnInit(): void {
    // ¿estamos en /tables/edit/:id ?
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;

    if (this.isEdit && idParam) {
      this.productId = +idParam;
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.form.patchValue({
          titulo: product.titulo,
          descripcion: product.descripcion,
          estado: product.estado,
          precio: product.precio,
          cantidad: product.cantidad,
          imagen: product.imagen
        });
        this.loading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando producto', err);
        this.errorMsg = 'No se pudo cargar el producto.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, ...formValues } = this.form.value as unknown as Product;
    const payload: Product = {
      id: this.productId ?? 0,
      ...formValues
    };

    this.saving = true;
    this.errorMsg = '';

    if (this.isEdit && this.productId) {
      // editar
      this.productService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/tables']);
        },
        error: (err: unknown) => {
          console.error('Error actualizando producto', err);
          this.errorMsg = 'No se pudo actualizar el producto.';
          this.saving = false;
        }
      });
    } else {
      // crear
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/tables']);
        },
        error: (err: unknown) => {
          console.error('Error creando producto', err);
          this.errorMsg = 'No se pudo crear el producto.';
          this.saving = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tables']);
  }

  // helpers para el template
  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.touched && control.hasError(error);
  }
}
