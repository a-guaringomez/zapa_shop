import { cargarCarrito, getCarrito, incrementarCantidad, decrementarCantidad, eliminarDelCarrito, vaciarCarrito } from './state/carrito.js';
import { setBusqueda, renderizarProductos, renderizarCarrito, renderizarTotales, actualizarBadge } from './ui/renderizador.js';
import { abrirSelectorTalla, generarFactura, mostrarToast, configurarModalTalla } from './ui/modales.js';
import { imgFallback } from './utils/formateo.js';

function configurarFiltros() {
  document.querySelectorAll('.btn-filtro').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderizarProductos(this.dataset.filtro);
    });
  });
}

function configurarBusqueda() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', function () {
    setBusqueda(this.value);
    const activo = document.querySelector('.btn-filtro.active');
    renderizarProductos(activo ? activo.dataset.filtro : 'todos');
  });
}

function configurarCarritoUI() {
  document.getElementById('productosGrid')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-producto-id]');
    if (btn) abrirSelectorTalla(parseInt(btn.dataset.productoId));
  });

  document.getElementById('carritoItems')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-accion]');
    if (!btn) return;
    const item = btn.closest('[data-item-id]');
    if (!item) return;
    const id = parseInt(item.dataset.itemId);
    const talla = parseInt(item.dataset.itemTalla);
    const accion = btn.dataset.accion;

    if (accion === 'incrementar') incrementarCantidad(id, talla);
    else if (accion === 'decrementar') decrementarCantidad(id, talla);
    else if (accion === 'eliminar') eliminarDelCarrito(id, talla);

    renderizarCarrito();
    actualizarBadge();
  });
}

function configurarCompra() {
  const vaciarBtn = document.getElementById('vaciarCarritoBtn');
  if (vaciarBtn) {
    vaciarBtn.addEventListener('click', () => {
      if (getCarrito().length === 0) return;
      if (confirm('¿Estás seguro de vaciar el carrito?')) {
        vaciarCarrito();
        renderizarCarrito();
        actualizarBadge();
        mostrarToast('Carrito vaciado.');
      }
    });
  }

  const comprarBtn = document.getElementById('comprarBtn');
  if (comprarBtn) {
    comprarBtn.addEventListener('click', () => {
      if (getCarrito().length === 0) {
        mostrarToast('Agrega productos al carrito primero.');
        return;
      }
      const form = document.getElementById('checkoutForm');
      if (form) form.reset();
      const modalEl = document.getElementById('checkoutModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  }
}

function configurarCheckout() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.checkValidity()) {
      this.classList.add('was-validated');
      return;
    }

    const datos = {
      nombres: document.getElementById('clienteNombres').value.trim(),
      apellidos: document.getElementById('clienteApellidos').value.trim(),
      documento: document.getElementById('clienteDocumento').value.trim(),
      telefono: document.getElementById('clienteTelefono').value.trim(),
      email: document.getElementById('clienteEmail').value.trim(),
      direccion: document.getElementById('clienteDireccion').value.trim()
    };

    generarFactura(datos);
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) bootstrap.Modal.getInstance(checkoutModal)?.hide();
    vaciarCarrito();
    renderizarCarrito();
    actualizarBadge();

    const facturaModal = document.getElementById('facturaModal');
    if (facturaModal) {
      const modal = new bootstrap.Modal(facturaModal);
      modal.show();
    }
  });
}

function configurarFactura() {
  const imprimirBtn = document.getElementById('imprimirFacturaBtn');
  if (imprimirBtn) {
    imprimirBtn.addEventListener('click', () => window.print());
  }
}

function init() {
  cargarCarrito();
  configurarFiltros();
  configurarBusqueda();
  configurarModalTalla();
  configurarCarritoUI();
  configurarCompra();
  configurarCheckout();
  configurarFactura();
  renderizarProductos();
  renderizarCarrito();
  actualizarBadge();
}

window.imgFallback = imgFallback;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
