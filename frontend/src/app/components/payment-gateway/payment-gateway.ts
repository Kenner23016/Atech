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
      cardHolder: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      // 0000-0000-0000-0000
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\d{4}-){3}\d{4}$/),
          Validators.minLength(19),
          Validators.maxLength(19)
        ]
      ],
      // DD/MM/AAAA con validación de fecha real
      expiry: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/),
          this.validateDate.bind(this)
        ]
      ],
      cvv: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}$/),
        Validators.minLength(3),
        Validators.maxLength(3)
      ]]
    });
  }

  // Formato número de tarjeta: 0000-0000-0000-0000 (MEJORADO)
  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    // Guardar posición del cursor
    const cursorPosition = input.selectionStart;
    
    // Solo números
    let value = input.value.replace(/\D/g, '');
    
    // Máximo 16 dígitos
    value = value.slice(0, 16);
    
    // Agrupar en bloques de 4
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += value[i];
    }
    
    // Establecer valor
    input.value = formatted;
    this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
    
    // Restaurar posición del cursor (ajustando por guiones)
    if (cursorPosition !== null) {
      let newPosition = cursorPosition;
      // Si estamos después de un guión que debería estar, ajustar
      if (cursorPosition > 0 && formatted[cursorPosition - 1] === '-') {
        newPosition++;
      }
      input.setSelectionRange(newPosition, newPosition);
    }
  }

  // Formato fecha: DD/MM/AAAA (MEJORADO)
  onDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    // Guardar posición del cursor
    const cursorPosition = input.selectionStart;
    
    // Solo números y eliminar barras existentes
    let value = input.value.replace(/[^\d]/g, '');
    
    // Máximo 8 dígitos (DDMMYYYY)
    value = value.slice(0, 8);
    
    let formatted = value;
    
    // Formatear con barras
    if (value.length >= 3) {
      formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length >= 5) {
      formatted = formatted.slice(0, 5) + '/' + value.slice(4, 8);
    }
    
    // Establecer valor
    input.value = formatted;
    this.paymentForm.get('expiry')?.setValue(formatted, { emitEvent: false });
    
    // Restaurar posición del cursor (ajustando por barras)
    if (cursorPosition !== null) {
      let newPosition = cursorPosition;
      // Ajustar si estamos en posición de barra
      if ((cursorPosition === 3 || cursorPosition === 6) && value.length >= cursorPosition) {
        newPosition++;
      }
      input.setSelectionRange(newPosition, newPosition);
    }
  }

  // Validación personalizada para fecha
  validateDate(control: any) {
    const value = control.value;
    
    if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return null; // Ya está validado por pattern
    }
    
    const parts = value.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Validar mes
    if (month < 1 || month > 12) {
      return { invalidMonth: true };
    }
    
    // Validar día según mes
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      return { invalidDay: true };
    }
    
    // Validar que no sea fecha pasada (opcional)
    const today = new Date();
    const inputDate = new Date(year, month - 1, day);
    if (inputDate < today) {
      return { pastDate: true };
    }
    
    return null; // Fecha válida
  }

  // Validación para CVV (solo números)
  onCvvInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 3);
    this.paymentForm.get('cvv')?.setValue(input.value, { emitEvent: false });
  }

  // Solo letras y espacios para titular
  onCardHolderInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Permitir letras, espacios y caracteres especiales del español
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    this.paymentForm.get('cardHolder')?.setValue(input.value, { emitEvent: false });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      // Simulamos espera de 2 segundos
      setTimeout(() => {
        this.isLoading = false;
        this.success = true;
        // Emitimos que el pago fue exitoso (simulación)
        this.paymentSuccess.emit(this.producto);
      }, 2000);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.paymentForm.controls).forEach(key => {
        const control = this.paymentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cerrarModal() {
    this.closed.emit();
  }

  // Helper para mostrar errores en el template
  getErrorMessage(controlName: string): string {
    const control = this.paymentForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    const errors = control.errors;
    
    if (errors['required']) {
      return 'Este campo es requerido';
    }
    
    if (errors['pattern']) {
      switch(controlName) {
        case 'cardNumber':
          return 'Formato inválido. Use: 0000-0000-0000-0000';
        case 'expiry':
          return 'Formato inválido. Use: DD/MM/AAAA';
        case 'cvv':
          return 'CVV debe tener 3 dígitos';
        case 'cardHolder':
          return 'Solo letras y espacios permitidos';
      }
    }
    
    if (errors['invalidMonth']) {
      return 'Mes inválido (1-12)';
    }
    
    if (errors['invalidDay']) {
      return 'Día inválido para este mes';
    }
    
    if (errors['pastDate']) {
      return 'La fecha no puede ser en el pasado';
    }
    
    if (errors['minlength'] || errors['maxlength']) {
      return `Debe tener exactamente ${controlName === 'cvv' ? '3' : '19'} caracteres`;
    }
    
    return 'Valor inválido';
  }
}