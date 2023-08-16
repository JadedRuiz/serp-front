import { Component } from '@angular/core';

interface CartItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Product {
  name: string;
  price: number;
  barcode: string; // Agrega el código de barras a la interfaz de productos
}

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.component.html',
  styleUrls: ['./punto-de-venta.component.scss']
})
export class PuntoDeVentaComponent {
  cartItems: CartItem[] = [];

  products: Product[] = [ // Cambia el tipo de products a Product[]
    { name: 'Producto 1', price: 10, barcode: '123456' }, // Agrega códigos de barras a los productos
    { name: 'Producto 2', price: 15, barcode: '789012' },
    { name: 'Producto 3', price: 20, barcode: '345678' },
    // ... Agregar más productos
  ];

  barcodeInput: string = ''; // Variable para almacenar el código de barras

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  }

  addProductToCart(product: Product) { // Cambia el tipo de producto en este método
    const existingItem = this.cartItems.find(item => item.productName === product.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({ productName: product.name, quantity: 1, price: product.price });
    }
  }

  checkout() {
    // Aquí podrías agregar la lógica para procesar la compra
  }

  addProductByBarcode() {
    const product = this.products.find(prod => prod.barcode === this.barcodeInput);

    if (product) {
      this.addProductToCart(product);
    } else {
      console.log('Producto no encontrado');
    }

    // Limpiamos el input de código de barras
    this.barcodeInput = '';
  }


  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  addExampleItemToCart() {
    const exampleProduct1 = this.products[0];
    const exampleProduct2 = this.products[1];
    const exampleProduct3 = this.products[2];

    this.addProductToCart(exampleProduct1);
    this.addProductToCart(exampleProduct2);
    this.addProductToCart(exampleProduct3);
  }

  constructor() {
    this.addExampleItemToCart();
  }
}
