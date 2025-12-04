import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Importante para *ngIf y pipes
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <--- Importante para formularios

@Component({
  selector: 'app-payment-gateway',
  standalone: true, // Asegúrate de que esto esté en true
  imports: [CommonModule, ReactiveFormsModule], // <--- AQUÍ AGREGAMOS LAS IMPORTACIONES QUE FALTABAN
  templateUrl: './payment-gateway.html',
  styleUrls: ['./payment-gateway.scss']
})
export class PaymentGatewayComponent {
  @Input() producto: any;
  @Output() close = new EventEmitter<void>();

  paymentForm: FormGroup;
  isLoading = false;
  success = false;

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
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
      }, 2000);
    }
  }

  cerrarModal() {
    this.close.emit();
  }
}
