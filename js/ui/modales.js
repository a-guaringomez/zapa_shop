import { obtenerProducto } from '../data/productos.js';
import { agregarAlCarrito, getCarrito, vaciarCarrito, calcularTotales } from '../state/carrito.js';
import { formatearCOP } from '../utils/formateo.js';

let modalInstancias = {};

function getModal(id) {
  if (!modalInstancias[id]) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (id === 'carritoOffcanvas') {
      modalInstancias[id] = new bootstrap.Offcanvas(el);
    } else {
      modalInstancias[id] = new bootstrap.Modal(el);
    }
  }
  return modalInstancias[id];
}

export function abrirSelectorTalla(id) {
  const producto = obtenerProducto(id);
  if (!producto) return;

  const img = document.getElementById('tallaProductoImg');
  const nombre = document.getElementById('tallaProductoNombre');
  const grid = document.getElementById('tallaGrid');

  if (img) { img.src = producto.imagen; img.alt = producto.nombre; }
  if (nombre) nombre.textContent = producto.nombre;
  if (grid) grid.dataset.productoId = id;

  document.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('agregarConTallaBtn');
  if (btn) btn.disabled = true;

  const modal = getModal('tallaModal');
  if (modal) modal.show();
}

export function generarFactura(datos) {
  const { subtotal, iva, total } = calcularTotales();
  const numeroFactura = `FAC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const fecha = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const filasProductos = getCarrito().map(item => {
    const prod = obtenerProducto(item.id);
    if (!prod) return '';
    const subt = prod.precio * item.cantidad;
    return `
      <tr>
        <td>${prod.nombre} <small class="text-muted">(Talla ${item.talla})</small></td>
        <td class="text-center">${item.cantidad}</td>
        <td class="text-end">${formatearCOP(prod.precio)}</td>
        <td class="text-end">${formatearCOP(subt)}</td>
      </tr>
    `;
  }).join('');

  const contenido = document.getElementById('facturaContenido');
  if (!contenido) return;

  contenido.innerHTML = `
    <div class="factura-wrapper" id="facturaParaImprimir">
      <div class="factura-header d-flex justify-content-between align-items-start">
        <div>
          <h4><i class="bi bi-bag-check me-2"></i>ZapaShop</h4>
          <div class="factura-detalle">
            <strong>N°:</strong> ${numeroFactura}<br>
            <strong>Fecha:</strong> ${fecha}
          </div>
        </div>
        <div class="text-end">
          <div class="factura-detalle">
            <strong>NIT:</strong> 901.123.456-7<br>
            <strong>Régimen:</strong> Común
          </div>
        </div>
      </div>
      <div class="factura-cliente">
        <strong class="d-block mb-1">DATOS DEL CLIENTE</strong>
        <p><strong>Nombre:</strong> ${datos.nombres} ${datos.apellidos}</p>
        <p><strong>Documento:</strong> ${datos.documento}</p>
        <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        <p><strong>Dirección:</strong> ${datos.direccion}</p>
      </div>
      <table class="factura-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th class="text-center">Cant.</th>
            <th class="text-end">Precio</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>${filasProductos}</tbody>
      </table>
      <div class="factura-totales">
        <div class="total-row"><span>Subtotal</span><span>${formatearCOP(subtotal)}</span></div>
        <div class="total-row"><span>IVA (19%)</span><span>${formatearCOP(iva)}</span></div>
        <div class="total-row grande"><span>TOTAL A PAGAR</span><span>${formatearCOP(total)}</span></div>
      </div>
      <div class="factura-footer">
        <p>Gracias por tu compra. Este documento es válido como factura de venta.</p>
        <p>ZapaShop - Bogotá, Colombia</p>
      </div>
    </div>
  `;
}

export function mostrarToast(mensaje) {
  const el = document.getElementById('toastMessage');
  if (el) el.textContent = mensaje;
  const toast = document.getElementById('notificacionToast');
  if (toast) {
    const inst = bootstrap.Toast.getOrCreateInstance(toast);
    inst.show();
  }
}

export function configurarModalTalla() {
  const grid = document.getElementById('tallaGrid');
  if (!grid) return;

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.talla-btn');
    if (!btn) return;
    document.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const agregarBtn = document.getElementById('agregarConTallaBtn');
    if (agregarBtn) agregarBtn.disabled = false;
    const cantContainer = document.getElementById('tallaCantidadContainer');
    if (cantContainer) {
      cantContainer.classList.remove('d-none');
      cantContainer.classList.add('d-inline-flex');
    }
    const cantVal = document.getElementById('tallaCantidadValue');
    if (cantVal) cantVal.textContent = '1';
  });

  const decBtn = document.getElementById('decrementarCantidadTalla');
  const incBtn = document.getElementById('incrementarCantidadTalla');
  if (decBtn) {
    decBtn.addEventListener('click', () => {
      const val = parseInt(document.getElementById('tallaCantidadValue').textContent);
      if (val > 1) document.getElementById('tallaCantidadValue').textContent = val - 1;
    });
  }
  if (incBtn) {
    incBtn.addEventListener('click', () => {
      const val = parseInt(document.getElementById('tallaCantidadValue').textContent);
      if (val < 99) document.getElementById('tallaCantidadValue').textContent = val + 1;
    });
  }

  const agregarBtn = document.getElementById('agregarConTallaBtn');
  if (agregarBtn) {
    agregarBtn.addEventListener('click', () => {
      const id = parseInt(grid.dataset.productoId);
      const tallaBtn = document.querySelector('.talla-btn.active');
      if (!tallaBtn) return;
      const talla = parseInt(tallaBtn.dataset.talla);
      const cantidad = parseInt(document.getElementById('tallaCantidadValue').textContent);
      const producto = obtenerProducto(id);
      if (!producto) return;

      agregarAlCarrito(id, talla, cantidad);

      import('./renderizador.js').then(({ renderizarCarrito, actualizarBadge }) => {
        renderizarCarrito();
        actualizarBadge();
      });

      mostrarToast(`${producto.nombre} Talla ${talla} (${cantidad} par(es)) agregado al carrito.`);
      const modal = getModal('tallaModal');
      if (modal) modal.hide();
    });
  }

  const modalEl = document.getElementById('tallaModal');
  if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.talla-btn').forEach(b => b.classList.remove('active'));
      if (agregarBtn) agregarBtn.disabled = true;
      const cantContainer = document.getElementById('tallaCantidadContainer');
      if (cantContainer) {
        cantContainer.classList.add('d-none');
        cantContainer.classList.remove('d-inline-flex');
      }
      const cantVal = document.getElementById('tallaCantidadValue');
      if (cantVal) cantVal.textContent = '1';
    });
  }
}
