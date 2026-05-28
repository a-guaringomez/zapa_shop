import { obtenerProducto } from '../data/productos.js';

let carrito = [];

export function cargarCarrito() {
  const datos = localStorage.getItem('zapashop_carrito');
  carrito = datos ? JSON.parse(datos) : [];
}

function guardarCarrito() {
  localStorage.setItem('zapashop_carrito', JSON.stringify(carrito));
}

export function getCarrito() {
  return carrito;
}

export function agregarAlCarrito(id, talla, cantidad = 1) {
  const existente = carrito.find(item => item.id === id && item.talla === talla);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id, talla, cantidad });
  }
  guardarCarrito();
}

export function incrementarCantidad(id, talla) {
  const item = carrito.find(i => i.id === id && i.talla === talla);
  if (item) {
    item.cantidad += 1;
    guardarCarrito();
  }
}

export function decrementarCantidad(id, talla) {
  const item = carrito.find(i => i.id === id && i.talla === talla);
  if (!item) return;
  if (item.cantidad > 1) {
    item.cantidad -= 1;
  } else {
    eliminarDelCarrito(id, talla);
    return;
  }
  guardarCarrito();
}

export function eliminarDelCarrito(id, talla) {
  carrito = carrito.filter(i => !(i.id === id && i.talla === talla));
  guardarCarrito();
}

export function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

export function calcularTotales() {
  const subtotal = carrito.reduce((sum, item) => {
    const prod = obtenerProducto(item.id);
    return sum + (prod ? prod.precio * item.cantidad : 0);
  }, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
