import { productos, obtenerProducto } from '../data/productos.js';
import { getCarrito, calcularTotales } from '../state/carrito.js';
import { formatearCOP } from '../utils/formateo.js';

let busquedaActual = '';

export function setBusqueda(valor) {
  busquedaActual = valor;
}

export function getBusqueda() {
  return busquedaActual;
}

export function renderizarProductos(filtro = 'todos') {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;

  let productosFiltrados = filtro === 'todos'
    ? [...productos]
    : productos.filter(p => p.categoria === filtro);

  if (busquedaActual.trim()) {
    const termino = busquedaActual.trim().toLowerCase();
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino)
    );
  }

  if (productosFiltrados.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-box-seam" style="font-size: 3rem; color: #b2bec3;"></i>
        <p class="text-muted mt-3 fs-5">No hay productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productosFiltrados.map(p => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card product-card">
        <div class="card-img-wrapper" style="background: ${p.gradiente};" data-icono="${p.icono}">
          <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="window.imgFallback(this)">
        </div>
        <div class="card-body d-flex flex-column">
          <span class="card-categoria mb-1">${p.categoria}</span>
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text flex-grow-1">${p.descripcion}</p>
          <div class="d-flex align-items-center justify-content-between mt-auto">
            <span class="card-precio">${formatearCOP(p.precio)}</span>
            <button class="btn btn-agregar" data-producto-id="${p.id}" type="button">
              <i class="bi bi-rulers me-1"></i>Talla
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

export function renderizarCarrito() {
  const container = document.getElementById('carritoItems');
  if (!container) return;

  const carrito = getCarrito();

  if (carrito.length === 0) {
    container.innerHTML = `
      <div class="carrito-vacio">
        <i class="bi bi-cart-x"></i>
        <p>Tu carrito está vacío</p>
        <span class="text-muted small">Explora nuestros productos y agrega tus favoritos.</span>
      </div>
    `;
    renderizarTotales();
    return;
  }

  container.innerHTML = carrito.map(item => {
    const prod = obtenerProducto(item.id);
    if (!prod) return '';
    const subtotal = prod.precio * item.cantidad;
    return `
      <div class="carrito-item" data-item-id="${item.id}" data-item-talla="${item.talla}">
        <div class="d-flex align-items-start gap-3">
          <div class="flex-grow-1">
            <div class="item-nombre">${prod.nombre} <span class="text-muted small fw-normal">Talla ${item.talla}</span></div>
            <div class="item-precio">${formatearCOP(prod.precio)} c/u</div>
            <div class="d-flex align-items-center justify-content-between mt-2">
              <div class="cantidad-control">
                <button class="btn-cantidad" data-accion="decrementar" type="button">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="cantidad-value">${item.cantidad}</span>
                <button class="btn-cantidad" data-accion="incrementar" type="button">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              <span class="item-subtotal">Sub: ${formatearCOP(subtotal)}</span>
            </div>
          </div>
          <button class="btn-eliminar-item" data-accion="eliminar" type="button" title="Eliminar">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  renderizarTotales();
}

export function renderizarTotales() {
  const { subtotal, iva, total } = calcularTotales();
  const subEl = document.getElementById('subtotalTotal');
  const ivaEl = document.getElementById('ivaTotal');
  const totEl = document.getElementById('totalGeneral');
  if (subEl) subEl.textContent = formatearCOP(subtotal);
  if (ivaEl) ivaEl.textContent = formatearCOP(iva);
  if (totEl) totEl.textContent = formatearCOP(total);
}

export function actualizarBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const total = getCarrito().reduce((sum, item) => sum + item.cantidad, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}
