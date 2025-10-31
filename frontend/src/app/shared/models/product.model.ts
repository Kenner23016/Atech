import { ProductState } from './product-state.enum';

export interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  estado: ProductState; 
  precio: number;
  cantidad: number;
  imagen: string;
}

export { ProductState };
