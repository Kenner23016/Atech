import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-gateway.html',
  styleUrls: ['./payment-gateway.scss']
})
export class PaymentGatewayComponent {
  @Input() producto: any;
  @Output() closed = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();

  paymentForm: FormGroup;
  isLoading = false;
  success = false;

  constructor(private readonly fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiry: ['', Validators.required],
      cvv: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      // Simulamos espera de 2 segundos
      setTimeout(() => {
        this.isLoading = false;
        this.success = true;
        // Emitimos que el pago fue exitoso
        this.paymentSuccess.emit(this.producto);
      }, 2000);
    }
  }

  cerrarModal() {
    this.closed.emit();
  }
}
